'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { EditableField } from './sectionCustomization'

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <p className="text-[11px] font-semibold text-slate-700">{children}</p>
      {hint ? <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{hint}</p> : null}
    </div>
  )
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200'

export function TemplateContentPanel({
  fields,
  texts,
  onChange,
  onClear,
}: {
  fields: EditableField[]
  texts: Record<string, string>
  onChange: (name: string, value: string) => void
  onClear: () => void
}) {
  if (!fields.length) {
    return (
      <p className="rounded-lg border border-dashed px-3 py-8 text-center text-xs leading-5 text-slate-500">
        Este bloco não expõe props editáveis no catálogo. Use a aba Imagens ou o Prompt IA para
        ajustes finos.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs leading-5 text-slate-500">
        Edite cada elemento do bloco. Textos e opções entram na prévia (quando possível) e no código
        exportado.
      </p>

      {fields.map((field) => {
        if (field.kind === 'text') {
          return (
            <div key={field.name}>
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={texts[field.name] ?? ''}
                  placeholder={field.description}
                  onChange={(event) => onChange(field.name, event.target.value)}
                  className={inputClass}
                />
              ) : (
                <input
                  type="text"
                  value={texts[field.name] ?? ''}
                  placeholder={field.description}
                  onChange={(event) => onChange(field.name, event.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          )
        }

        if (field.kind === 'action') {
          const labelKey = `${field.name}.label`
          const hrefKey = `${field.name}.href`
          return (
            <div key={field.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <div className="space-y-2">
                <input
                  type="text"
                  value={texts[labelKey] ?? ''}
                  placeholder="Texto do botão / link"
                  onChange={(event) => onChange(labelKey, event.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  value={texts[hrefKey] ?? ''}
                  placeholder="Link (ex.: #contato ou /empresa)"
                  onChange={(event) => onChange(hrefKey, event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )
        }

        if (field.kind === 'object') {
          return (
            <div key={field.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <div className="space-y-2">
                {field.keys.map((item) => {
                  const key = `${field.name}.${item.key}`
                  return (
                    <div key={key}>
                      <p className="mb-1 text-[10px] font-medium text-slate-500">{item.label}</p>
                      <input
                        type="text"
                        value={texts[key] ?? ''}
                        onChange={(event) => onChange(key, event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        if (field.kind === 'select') {
          return (
            <div key={field.name}>
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <select
                value={texts[field.name] ?? ''}
                onChange={(event) => onChange(field.name, event.target.value)}
                className={inputClass}
              >
                <option value="">Padrão do componente</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (field.kind === 'boolean') {
          const checked = texts[field.name] === 'true'
          return (
            <label
              key={field.name}
              className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
            >
              <input
                type="checkbox"
                className="mt-0.5"
                checked={checked}
                onChange={(event) => onChange(field.name, event.target.checked ? 'true' : 'false')}
              />
              <span>
                <span className="block text-sm font-medium text-slate-800">{field.label}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{field.description}</span>
              </span>
            </label>
          )
        }

        if (field.kind === 'number') {
          return (
            <div key={field.name}>
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <input
                type="number"
                value={texts[field.name] ?? ''}
                onChange={(event) => onChange(field.name, event.target.value)}
                className={inputClass}
              />
            </div>
          )
        }

        if (field.kind === 'chips') {
          return (
            <div key={field.name}>
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <input
                type="text"
                value={texts[`chips:${field.name}`] ?? texts[field.name] ?? ''}
                placeholder="Ex.: Processo controlado, Normas do setor"
                onChange={(event) => onChange(`chips:${field.name}`, event.target.value)}
                className={inputClass}
              />
            </div>
          )
        }

        if (field.kind === 'json') {
          return (
            <div key={field.name}>
              <FieldLabel hint={field.description}>{field.label}</FieldLabel>
              <textarea
                rows={5}
                value={texts[`json:${field.name}`] ?? ''}
                placeholder={'[\n  { "title": "...", "description": "..." }\n]'}
                onChange={(event) => onChange(`json:${field.name}`, event.target.value)}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
          )
        }

        return null
      })}

      <Button type="button" size="sm" variant="outline" className="w-full" onClick={onClear}>
        Limpar textos e opções
      </Button>
    </div>
  )
}
