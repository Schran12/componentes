import { normalizeSearch } from '@/components/library/catalog/catalogSearch'
import { layoutRecipes } from '@/components/library/catalog/layoutRecipes'

export type NicheHint = {
  /** Trechos que podem aparecer no texto (já sem acento). */
  phrases: string[]
  recipeIds: string[]
  blurb: string
  label: string
}

/**
 * Nicho por frases/radicais no texto contínuo — funciona com gíria e erros.
 * Ordem: mais específico primeiro.
 */
export const NICHE_HINTS: NicheHint[] = [
  {
    phrases: [
      'galvaniz',
      'zincagem',
      'fosfat',
      'tratamento de superficie',
      'tratamento metal',
      'funilar',
      'solda',
      'usinagem',
      'tornearia',
      'pintura industrial',
      'metalurg',
      'oficina mecan',
      'oficina de',
      'industria',
      'industrial',
      'fabrica',
      'manufatur',
    ],
    recipeIds: ['industrial-services', 'industrial'],
    blurb: 'Interpretei como negócio industrial / oficina / tratamento.',
    label: 'Industrial / oficina',
  },
  {
    phrases: [
      'clinica',
      'consultorio',
      'dentista',
      'odont',
      'psicolog',
      'psico',
      'fisio',
      'estetica',
      'hospital',
      'terapia',
      'nutri',
      'medico',
      'medica',
      'saude',
      'dermat',
      'veterinar',
      'pet shop',
      'petshop',
      'banho e tosa',
    ],
    recipeIds: ['clinic'],
    blurb: 'Interpretei como saúde / clínica / bem-estar.',
    label: 'Clínica / saúde',
  },
  {
    phrases: [
      'barbearia',
      'barbeiro',
      'salao de beleza',
      'salao',
      'cabeleireir',
      'manicure',
      'spa ',
      'spa',
    ],
    recipeIds: ['clinic', 'landing-page'],
    blurb: 'Interpretei como salão / barbearia (serviço local).',
    label: 'Salão / barbearia',
  },
  {
    phrases: [
      'restaurante',
      'lanchonete',
      'pizzaria',
      'hamburguer',
      'burger',
      'padaria',
      'confeitaria',
      'cardapio',
      'delivery',
      'comida',
      'churrascaria',
      'cafeteria',
      'cafe ',
      'bar ',
      'boteco',
      'acai',
    ],
    recipeIds: ['restaurant'],
    blurb: 'Interpretei como food service / restaurante.',
    label: 'Restaurante / comida',
  },
  {
    phrases: [
      'imobili',
      'corretor',
      'apartamento',
      'aluguel',
      'lancamento imob',
      'venda de imove',
      'casas a venda',
    ],
    recipeIds: ['real-estate'],
    blurb: 'Interpretei como imobiliária / corretagem.',
    label: 'Imobiliária',
  },
  {
    phrases: [
      'ecommerce',
      'e-commerce',
      'loja online',
      'loja virtual',
      'vender produto',
      'vitrine',
      'carrinho',
      'marketplace',
      'dropshipping',
    ],
    recipeIds: ['ecommerce'],
    blurb: 'Interpretei como loja / e-commerce.',
    label: 'E-commerce',
  },
  {
    phrases: [
      'saas',
      'software',
      'aplicativo',
      'app de',
      'plataforma',
      'assinatura',
      'startup',
      'sistema online',
      'produto digital',
    ],
    recipeIds: ['saas', 'fintech'],
    blurb: 'Interpretei como produto digital / SaaS.',
    label: 'SaaS / app',
  },
  {
    phrases: [
      'fintech',
      'banco',
      'investimento',
      'credito',
      'pagamento',
      'financeiro',
      'contabilidade',
      'contabil',
    ],
    recipeIds: ['fintech', 'saas'],
    blurb: 'Interpretei como fintech / serviços financeiros.',
    label: 'Fintech / financeiro',
  },
  {
    phrases: [
      'agencia',
      'freelancer',
      'designer',
      'portfolio',
      'estudio de',
      'criativo',
      'marketing digital',
      'publicidade',
      'fotografo',
      'fotografia',
    ],
    recipeIds: ['agency'],
    blurb: 'Interpretei como agência / portfólio.',
    label: 'Agência / portfólio',
  },
  {
    phrases: [
      'evento',
      'congresso',
      'workshop',
      'ingresso',
      'festival',
      'palestra',
      'show ',
      'conferencia',
    ],
    recipeIds: ['event'],
    blurb: 'Interpretei como divulgação de evento.',
    label: 'Evento',
  },
  {
    phrases: [
      'ong',
      'doacao',
      'doações',
      'causa social',
      'voluntario',
      'instituto',
      'igreja',
      'paroquia',
      'templo',
      'projeto social',
    ],
    recipeIds: ['nonprofit'],
    blurb: 'Interpretei como ONG / causa / comunidade.',
    label: 'ONG / causa',
  },
  {
    phrases: [
      'curso online',
      'curso ',
      'escola',
      'faculdade',
      'mentoria',
      'treinamento',
      'ead',
      'aula ',
      'educacao',
      'professor',
      'ensin',
    ],
    recipeIds: ['education'],
    blurb: 'Interpretei como educação / curso.',
    label: 'Educação',
  },
  {
    phrases: ['blog', 'artigos', 'noticias', 'revista', 'editorial', 'conteudo'],
    recipeIds: ['blog'],
    blurb: 'Interpretei como blog / conteúdo.',
    label: 'Blog',
  },
  {
    phrases: [
      'landing',
      'campanha',
      'captura de lead',
      'pagina de vendas',
      'pagina de captura',
      'lancamento',
      'promo',
    ],
    recipeIds: ['landing-page'],
    blurb: 'Interpretei como landing / campanha.',
    label: 'Landing page',
  },
  {
    phrases: [
      'advogad',
      'advocacia',
      'escritorio de advocacia',
      'consultoria',
      'institucional',
      'corporativ',
      'empresa de',
      'minha empresa',
      'nossa empresa',
      'b2b',
      'prestacao de servico',
      'prestador',
    ],
    recipeIds: ['institutional', 'institutional-corporate', 'consulting'],
    blurb: 'Interpretei como site institucional / serviços profissionais.',
    label: 'Institucional',
  },
]

/** Sinais de seção — frases no texto contínuo. */
const FEATURE_PHRASES: { phrases: string[]; keys: string[] }[] = [
  {
    phrases: ['whatsapp', 'zap', 'wpp', 'whats', 'orcamento', 'cotacao', 'pedido pelo'],
    keys: ['whatsapp', 'zap', 'orcamento'],
  },
  {
    phrases: ['faq', 'duvida', 'perguntas frequentes', 'q&a', 'tire suas duvidas'],
    keys: ['faq', 'duvida', 'perguntas'],
  },
  {
    phrases: ['equipe', 'time', 'profissionais', 'doutor', 'medicos', 'quem somos', 'sobre nos'],
    keys: ['equipe', 'time'],
  },
  {
    phrases: ['depoimento', 'avaliacao', 'review', 'o que dizem', 'clientes felizes'],
    keys: ['depoimento', 'avaliacao'],
  },
  {
    phrases: ['galeria', 'fotos', 'imagens', 'portfolio', 'trabalhos', 'antes e depois'],
    keys: ['galeria', 'foto', 'fotos'],
  },
  {
    phrases: ['mapa', 'endereco', 'localizacao', 'onde fica', 'como chegar'],
    keys: ['mapa', 'endereco', 'localizacao'],
  },
  {
    phrases: [
      'precos',
      'preco',
      'planos',
      'plano',
      'pricing',
      'tabela de precos',
      'valores',
      'mensalidade',
    ],
    keys: ['preco', 'plano', 'pricing', 'valores'],
  },
  {
    phrases: ['processo', 'etapas', 'como funciona', 'passo a passo', 'metodologia'],
    keys: ['processo', 'etapas', 'comofunciona'],
  },
  {
    phrases: ['contato', 'formulario', 'fale conosco', 'agendar', 'marcar horario', 'atendimento'],
    keys: ['contato', 'formulario', 'agendar'],
  },
  {
    phrases: ['blog', 'artigos', 'noticias', 'posts'],
    keys: ['blog', 'artigos'],
  },
  {
    phrases: ['servico', 'servicos', 'o que fazemos', 'tratamentos'],
    keys: ['servico', 'tratamentos'],
  },
  {
    phrases: ['cta', 'chamada', 'botao bem claro', 'quero comprar', 'assinar'],
    keys: ['cta'],
  },
]

const STOP = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'um',
  'uma',
  'uns',
  'umas',
  'o',
  'a',
  'os',
  'as',
  'e',
  'ou',
  'em',
  'no',
  'na',
  'nos',
  'nas',
  'pra',
  'pro',
  'para',
  'com',
  'sem',
  'por',
  'que',
  'quero',
  'preciso',
  'gostaria',
  'fazer',
  'faz',
  'ter',
  'meu',
  'minha',
  'meus',
  'minhas',
  'seu',
  'sua',
  'tipo',
  'algo',
  'assim',
  'bem',
  'mais',
  'menos',
  'muito',
  'pouco',
  'ja',
  'so',
  'ai',
  'eh',
  'ne',
  'ta',
  'to',
  'vc',
  'voce',
  'pq',
  'tb',
  'tbm',
  'mano',
  'cara',
  'opa',
  'oxe',
  'beleza',
  'valeu',
  'obrigado',
  'obrigada',
  'pf',
  'pfv',
  'porfavor',
  'por favor',
  'ajuda',
  'me',
  'te',
  'nos',
  'lhe',
  'isso',
  'esse',
  'essa',
  'este',
  'esta',
  'aqui',
  'ali',
  'la',
  'tem',
  'tenho',
  'somos',
  'sou',
  'seria',
  'pode',
  'poderia',
  'queria',
  'queria',
  'dai',
  'entao',
  'agora',
  'hoje',
])

function levenshtein(a: string, b: string) {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > 2) return 99
  if (!a.length) return b.length
  if (!b.length) return a.length
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i
    for (let j = 1; j <= b.length; j += 1) {
      const cur = a[i - 1] === b[j - 1] ? row[j - 1] : 1 + Math.min(row[j - 1], prev, row[j])
      row[j - 1] = prev
      prev = cur
    }
    row[b.length] = prev
  }
  return row[b.length]
}

function compact(text: string) {
  return normalizeSearch(text)
    .replace(/[^a-z0-9#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function rawTokens(text: string) {
  return compact(text)
    .split(' ')
    .filter((token) => token.length >= 2 && !STOP.has(token))
}

/** Extrai o “assunto” depois de padrões tipo “tenho uma X”, “sou Y”, “pra minha Z”. */
function extractSubjectPhrases(normalized: string): string[] {
  const subjects: string[] = []
  const patterns = [
    /\b(?:tenho|temos|e|eh|sou|somos|trabalho (?:com|em)|trabalhamos (?:com|em)|preciso (?:de|pra|para)|quero (?:um|uma|pra|para)|site (?:pra|para|de|da|do)|pagina (?:pra|para|de|da|do)|home (?:pra|para|de)|negocio (?:de|de uma|de um))\s+(.{3,60}?)(?:\s+com\s+|\s+e\s+(?:zap|whats|faq|foto)|$)/,
    /\b(?:pra|para)\s+(?:minha|meu|nossa|nosso)\s+(.{3,40}?)(?:\s+com\s+|$)/,
    /\b(?:oficina|loja|clinica|consultorio|empresa|agencia|igreja|escola|barbearia|lanchonete|restaurante|petshop|pet shop)\s+(?:de\s+)?(.{0,40})/,
  ]
  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (match?.[1]) subjects.push(match[1].trim())
  }
  return subjects
}

function hasWord(blob: string, word: string) {
  const w = normalizeSearch(word).trim()
  if (!w) return false
  // limite de palavra — evita “preciso” ⊃ “preco”
  return new RegExp(`(?:^|\\s)${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`).test(
    ` ${blob} `,
  )
}

function scorePhraseInText(blob: string, phrase: string, opts?: { allowPrefix?: boolean }) {
  const p = normalizeSearch(phrase).trim()
  if (!p) return 0
  if (hasWord(blob, p) || (p.includes(' ') && blob.includes(p))) {
    return p.length >= 8 ? 6 : p.length >= 5 ? 4 : 3
  }
  const parts = p.split(/\s+/).filter((part) => part.length >= 3)
  if (parts.length > 1 && parts.every((part) => hasWord(blob, part))) return 3

  // Radical: “galvaniz” em “galvanizacao” (só quando permitido)
  if (opts?.allowPrefix && p.length >= 5 && !p.includes(' ')) {
    for (const token of blob.split(' ')) {
      if (token.length >= p.length && token.startsWith(p)) return 5
    }
  }

  // Typo leve, mesma raiz (3 primeiras letras iguais)
  if (p.length >= 5 && !p.includes(' ')) {
    for (const token of blob.split(' ')) {
      if (token.length < 5) continue
      if (Math.abs(token.length - p.length) > 2) continue
      if (token.slice(0, 3) !== p.slice(0, 3)) continue
      if (levenshtein(token, p) <= 1) return 2
    }
  }
  return 0
}

export function matchNiche(normalized: string, tokens: string[]) {
  const blob = ` ${normalized} `
  const subjectBlob = extractSubjectPhrases(normalized).join(' ')
  let best: NicheHint | null = null
  let bestScore = 0

  for (const hint of NICHE_HINTS) {
    let score = 0
    for (const phrase of hint.phrases) {
      score += scorePhraseInText(blob, phrase, { allowPrefix: true })
      if (subjectBlob) score += scorePhraseInText(subjectBlob, phrase, { allowPrefix: true }) * 1.5
    }
    // bônus se token bate
    for (const token of tokens) {
      for (const phrase of hint.phrases) {
        const p = normalizeSearch(phrase).replace(/\s+/g, '')
        if (token === p || (token.length >= 4 && (token.includes(p) || p.includes(token)))) {
          score += 2
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = hint
    }
  }

  // Fallback: pontua recipes do catálogo por audience/description
  if (bestScore < 3) {
    let recipeBest: NicheHint | null = null
    let recipeScore = 0
    for (const recipe of layoutRecipes) {
      const hay = normalizeSearch(
        `${recipe.id} ${recipe.name} ${recipe.description} ${recipe.audience}`,
      )
      let score = 0
      for (const token of tokens) {
        if (token.length < 3) continue
        if (hay.includes(token)) score += token.length >= 5 ? 3 : 1
      }
      for (const subject of extractSubjectPhrases(normalized)) {
        for (const word of subject.split(' ')) {
          if (word.length >= 4 && hay.includes(word)) score += 4
        }
      }
      if (score > recipeScore) {
        recipeScore = score
        recipeBest = {
          phrases: [recipe.id],
          recipeIds: [recipe.id],
          blurb: `Interpretei pelo catálogo como próximo de “${recipe.name}”.`,
          label: recipe.name,
        }
      }
    }
    if (recipeBest && recipeScore > bestScore) {
      best = recipeBest
      bestScore = recipeScore
    }
  }

  return bestScore > 0 ? { hint: best!, score: bestScore } : null
}

function detectFeatures(normalized: string) {
  const keys = new Set<string>()
  for (const group of FEATURE_PHRASES) {
    if (group.phrases.some((phrase) => scorePhraseInText(normalized, phrase) > 0)) {
      for (const key of group.keys) keys.add(key)
    }
  }
  return [...keys]
}

export type UnderstoodQuery = {
  normalized: string
  tokens: string[]
  expanded: string[]
  niche: NicheHint | null
  nicheScore: number
  features: string[]
  intent: 'hello' | 'compare' | 'install' | 'create' | 'template' | 'component' | 'general'
  layoutConfidence: number
  interpretation: string
  subjects: string[]
}

/** Expande tokens + features + phrases de nicho detectadas. */
export function expandTokens(text: string): string[] {
  const normalized = compact(text)
  const tokens = rawTokens(text)
  const out = new Set<string>(tokens)
  const features = detectFeatures(normalized)
  for (const feature of features) out.add(feature)

  const niche = matchNiche(normalized, tokens)
  if (niche) {
    for (const phrase of niche.hint.phrases.slice(0, 8)) {
      out.add(normalizeSearch(phrase).replace(/\s+/g, ''))
    }
    for (const id of niche.hint.recipeIds) out.add(id)
  }

  for (const subject of extractSubjectPhrases(normalized)) {
    for (const word of subject.split(' ')) {
      if (word.length >= 3) out.add(word)
    }
  }

  // sinônimos rápidos
  if (features.includes('whatsapp') || /\bzap\b|\bwpp\b/.test(normalized)) {
    out.add('whatsapp')
    out.add('zap')
    out.add('orcamento')
  }
  if (/\bfoto|\bimagem|\bgaleria|\bportfolio/.test(normalized)) {
    out.add('galeria')
    out.add('fotos')
  }

  return [...out]
}

export function understandQuery(text: string): UnderstoodQuery {
  const normalized = compact(text)
  const tokens = rawTokens(text)
  const subjects = extractSubjectPhrases(normalized)
  const nicheHit = matchNiche(normalized, tokens)
  const niche = nicheHit?.hint ?? null
  const nicheScore = nicheHit?.score ?? 0
  const features = detectFeatures(normalized)
  const expanded = expandTokens(text)

  const isGreetingOnly =
    /^(ola|oi|eai|e ae|eae|fala|bom dia|boa tarde|boa noite|hey|hi)\b/.test(normalized) &&
    tokens.length <= 3 &&
    nicheScore === 0

  let intent: UnderstoodQuery['intent'] = 'general'
  if (isGreetingOnly) {
    intent = 'hello'
  } else if (/(diferenc|compara|\bvs\b|versus)/.test(normalized)) {
    intent = 'compare'
  } else if (/(como instalar|\bnpx\b|\bcli\b|baixar zip|download)/.test(normalized)) {
    intent = 'install'
  } else if (
    nicheScore > 0 ||
    features.length > 0 ||
    subjects.length > 0 ||
    /(site|pagina|home|layout|landing|negocio|empresa|loja|quero|preciso|gostaria|monte|montar|crie|criar|faz|faz um|me ajuda|ajuda a)/.test(
      normalized,
    )
  ) {
    intent = 'create'
  } else if (/(template|recipe|receita)/.test(normalized)) {
    intent = 'template'
  } else if (/(componente|navbar|hero|faq|footer|banner|props)/.test(normalized)) {
    intent = 'component'
  }

  let layoutConfidence = 0
  if (intent === 'create') layoutConfidence += 0.4
  if (nicheScore >= 4) layoutConfidence += 0.4
  else if (nicheScore >= 2) layoutConfidence += 0.3
  else if (nicheScore > 0) layoutConfidence += 0.2
  if (features.length >= 2) layoutConfidence += 0.2
  else if (features.length === 1) layoutConfidence += 0.12
  if (subjects.length) layoutConfidence += 0.15
  if (tokens.length >= 3) layoutConfidence += 0.08
  layoutConfidence = Math.min(1, layoutConfidence)

  // Se falou de um negócio, assume layout mesmo com score baixo
  if (niche || subjects.length || features.length) {
    layoutConfidence = Math.max(layoutConfidence, 0.55)
  }

  const interpretation = [
    niche ? `Nicho: ${niche.label}` : subjects[0] ? `Assunto: “${subjects[0]}”` : null,
    features.length ? `Seções: ${features.slice(0, 6).join(', ')}` : null,
    intent === 'create' ? 'Vou montar um layout' : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    normalized,
    tokens,
    expanded,
    niche,
    nicheScore,
    features,
    intent,
    layoutConfidence,
    interpretation: interpretation || 'Vou procurar o template mais próximo do que você descreveu.',
    subjects,
  }
}

export function tokensMatchAny(expanded: string[], candidates: string[]) {
  const blob = ` ${expanded.join(' ')} `
  return candidates.some((raw) => {
    const token = normalizeSearch(raw).replace(/\s+/g, '')
    if (!token) return false
    if (blob.includes(` ${token} `) || blob.includes(token)) return true
    return expanded.some((item) => {
      if (item === token) return true
      if (item.length >= 4 && token.length >= 4 && (item.includes(token) || token.includes(item))) {
        return true
      }
      if (item.length >= 5 && token.length >= 5 && levenshtein(item, token) <= 2) return true
      return false
    })
  })
}
