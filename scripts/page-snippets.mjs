import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const libraryBarrel = '@/components/library'
const ignoredPreviewFiles = new Set(['index.ts', 'types.ts', 'shared.tsx'])
const pageExamplesFile = 'pageExamples.tsx'

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function buildLibraryExportMap(root) {
  const libraryRoot = resolve(root, 'src/components/library')
  const exportPattern =
    /export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g
  const defaultExportPattern = /export\s+default\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g
  const map = new Map()

  for (const file of walk(libraryRoot)) {
    const relativePath = relative(libraryRoot, file).replaceAll('\\', '/')
    if (relativePath.startsWith('catalog/') || !/\.(ts|tsx)$/.test(file)) continue
    if (/(^|\/)index\.tsx?$/.test(relativePath)) continue

    const modulePath = `${libraryBarrel}/${relativePath.slice(0, -extname(relativePath).length)}`
    const content = readFileSync(file, 'utf8')
    const names = [
      ...[...content.matchAll(exportPattern)].map((match) => match[1]),
      ...[...content.matchAll(defaultExportPattern)].map((match) => match[1]),
      ...[...content.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)].flatMap((match) =>
        match[1]
          .split(',')
          .map((part) =>
            part
              .trim()
              .split(/\s+as\s+/)
              .pop(),
          )
          .filter(Boolean),
      ),
    ]
    for (const name of names) {
      if (!map.has(name)) map.set(name, modulePath)
    }
  }
  return map
}

function dedent(text, column) {
  if (!column) return text
  const indent = new RegExp(`^ {0,${column}}`)
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? line : line.replace(indent, '')))
    .join('\n')
}

function columnOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).character
}

function parseModule(file) {
  const sourceFile = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const imports = new Map()
  const declarations = new Map()

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause
      if (!clause || clause.isTypeOnly) continue
      const module = statement.moduleSpecifier.text
      if (clause.name) imports.set(clause.name.text, { module, imported: 'default' })
      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          if (element.isTypeOnly) continue
          imports.set(element.name.text, {
            module,
            imported: (element.propertyName ?? element.name).text,
          })
        }
      }
      continue
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue
        declarations.set(declaration.name.text, {
          node: declaration,
          code: `const ${declaration.getText(sourceFile)}`,
        })
      }
      continue
    }

    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, {
        node: statement,
        code: statement.getText(sourceFile).replace(/^export\s+(default\s+)?/, ''),
      })
    }
  }

  return { file, sourceFile, imports, declarations }
}

function referencedIdentifiers(node) {
  const names = new Set()

  function visit(current) {
    if (ts.isIdentifier(current)) {
      const parent = current.parent
      const isMemberName =
        (ts.isPropertyAccessExpression(parent) && parent.name === current) ||
        (ts.isPropertyAssignment(parent) && parent.name === current) ||
        (ts.isJsxAttribute(parent) && parent.name === current) ||
        (ts.isBindingElement(parent) && parent.propertyName === current) ||
        (ts.isQualifiedName(parent) && parent.right === current) ||
        (ts.isMethodDeclaration(parent) && parent.name === current) ||
        (ts.isPropertySignature(parent) && parent.name === current)
      if (!isMemberName) names.add(current.text)
    }
    ts.forEachChild(current, visit)
  }

  visit(node)
  return names
}

function unwrapParentheses(node) {
  let current = node
  while (ts.isParenthesizedExpression(current)) current = current.expression
  return current
}

function pascalCase(id) {
  return id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
}

function stripRootClassName(sourceFile, jsx) {
  const opening = ts.isJsxElement(jsx)
    ? jsx.openingElement
    : ts.isJsxSelfClosingElement(jsx)
      ? jsx
      : null
  if (!opening || !/^[A-Z]/.test(opening.tagName.getText(sourceFile))) {
    return jsx.getText(sourceFile)
  }

  const attribute = opening.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.getText(sourceFile) === 'className',
  )
  const text = jsx.getText(sourceFile)
  if (!attribute) return text

  const offset = jsx.getStart(sourceFile)
  const start = attribute.getFullStart() - offset
  const end = attribute.getEnd() - offset
  return text.slice(0, start) + text.slice(end)
}

/**
 * Extrai, de cada preview do catálogo, o JSX com dados reais e tudo o que ele usa
 * (declarações de apoio e imports) para montar páginas completas no construtor.
 */
export function extractPageSnippets({ root, componentIds }) {
  const previewDirectory = resolve(root, 'src/components/library/catalog/previews')
  const shared = parseModule(resolve(previewDirectory, 'shared.tsx'))
  const exportMap = buildLibraryExportMap(root)
  const snippets = new Map()

  const previewFiles = readdirSync(previewDirectory)
    .filter((fileName) => !ignoredPreviewFiles.has(fileName))
    .sort((a, b) => Number(a === pageExamplesFile) - Number(b === pageExamplesFile))

  for (const fileName of previewFiles) {
    const module = parseModule(resolve(previewDirectory, fileName))

    const previewMap = module.sourceFile.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => [...statement.declarationList.declarations])
      .find(
        (declaration) =>
          declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer),
      )
    if (!previewMap) continue

    for (const property of previewMap.initializer.properties) {
      if (!ts.isPropertyAssignment(property)) continue
      const id = ts.isStringLiteral(property.name) ? property.name.text : property.name.getText()
      if (!componentIds.has(id)) continue

      const initializer = property.initializer
      if (!ts.isArrowFunction(initializer) && !ts.isFunctionExpression(initializer)) continue

      const declarations = []
      const declared = new Set()
      const imports = new Map()

      function resolveName(name, context) {
        const declaration = context.declarations.get(name)
        if (declaration) {
          const key = `${context.file}:${name}`
          if (declared.has(key)) return
          declared.add(key)
          for (const reference of referencedIdentifiers(declaration.node)) {
            if (reference !== name) resolveName(reference, context)
          }
          declarations.push({ name, code: declaration.code })
          return
        }

        const imported = context.imports.get(name)
        if (!imported) return
        if (imported.module === './shared') {
          resolveName(imported.imported, shared)
          return
        }
        if (imported.module.startsWith('.')) return

        const module =
          imported.module === libraryBarrel ? exportMap.get(imported.imported) : imported.module
        if (!module) throw new Error(`Export "${imported.imported}" não encontrado na biblioteca`)
        imports.set(`${module}:${name}`, { module, name, imported: imported.imported })
      }

      const body = initializer.body
      const column = columnOf(module.sourceFile, property)
      let jsx
      if (ts.isBlock(body)) {
        const functionName = `${pascalCase(id)}Secao`
        for (const reference of referencedIdentifiers(body)) resolveName(reference, module)
        declarations.push({
          name: functionName,
          code: `function ${functionName}() ${dedent(body.getText(module.sourceFile), column)}`,
        })
        jsx = `<${functionName} />`
      } else {
        const expression = unwrapParentheses(body)
        for (const reference of referencedIdentifiers(expression)) resolveName(reference, module)
        jsx = dedent(stripRootClassName(module.sourceFile, expression), column + 2)
      }

      snippets.set(id, { id, jsx, declarations, imports: [...imports.values()] })
    }
  }

  return snippets
}
