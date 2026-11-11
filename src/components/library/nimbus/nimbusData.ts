/** Nimbus AI — document Q&A API catalogue data (mirrors public/nimbus/index.html). */

export type NmNavLink = { label: string; href: string }

export const NM_NAV_LINKS: readonly NmNavLink[] = [
  { label: 'Docs', href: '#docs' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Blog', href: '#blog' },
] as const

export type NmCapability = {
  id: string
  title: string
  description: string
  icon: 'summarise' | 'extract' | 'classify' | 'translate' | 'search' | 'cite'
}

export const NM_CAPABILITIES: readonly NmCapability[] = [
  {
    id: 'summarise',
    title: 'Summarise',
    description:
      'Condense multi-page PDFs into executive briefs with controllable length and tone.',
    icon: 'summarise',
  },
  {
    id: 'extract',
    title: 'Extract',
    description:
      'Pull structured fields — dates, amounts, parties — into JSON ready for your pipeline.',
    icon: 'extract',
  },
  {
    id: 'classify',
    title: 'Classify',
    description: 'Route contracts, invoices, and tickets with custom labels and confidence scores.',
    icon: 'classify',
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Preserve layout-aware meaning across 40+ languages without losing citations.',
    icon: 'translate',
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Semantic retrieval over your corpus with filters for file type, date, and ACL.',
    icon: 'search',
  },
  {
    id: 'cite',
    title: 'Cite sources',
    description: 'Every answer links back to page spans so reviewers can verify in one click.',
    icon: 'cite',
  },
] as const

export type NmUseCase = {
  id: string
  eyebrow: string
  title: string
  description: string
}

export const NM_USE_CASES: readonly NmUseCase[] = [
  {
    id: 'support',
    eyebrow: 'Customer support',
    title: 'Answer from the knowledge base',
    description:
      'Connect product manuals and help articles so agents — and bots — reply with cited passages instead of guesswork.',
  },
  {
    id: 'research',
    eyebrow: 'Research teams',
    title: 'Synthesize long reports fast',
    description:
      'Upload whitepapers and transcripts; ask for themes, contradictions, and quotable excerpts with page references.',
  },
  {
    id: 'legal',
    eyebrow: 'Legal & compliance',
    title: 'Ground answers in the clause',
    description:
      'Query NDAs and policies with source spans. Reviewers jump straight to the paragraph that backs each claim.',
  },
] as const

export type NmPricingTier = {
  id: string
  name: string
  price: string
  period: string
  blurb: string
  features: readonly string[]
  cta: string
  highlighted?: boolean
}

export const NM_PRICING_NOTE =
  'A request is one API call: summarise, ask, extract, classify, translate, or search against uploaded documents. Tokens are billed separately for large context windows.'

export const NM_PRICING_TIERS: readonly NmPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/ month',
    blurb: 'For prototypes and solo builders.',
    features: [
      '5,000 requests / month',
      '50 MB document storage',
      'Community support',
      'Standard models',
    ],
    cta: 'Get API key',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$149',
    period: '/ month',
    blurb: 'For product teams shipping to production.',
    features: [
      '50,000 requests / month',
      '5 GB document storage',
      'Priority email support',
      'Citation + ACL filters',
      'Webhook deliveries',
    ],
    cta: 'Start Growth',
    highlighted: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 'Custom',
    period: '',
    blurb: 'For high volume and strict compliance.',
    features: [
      'Volume request pricing',
      'Dedicated VPC / region',
      'SSO + audit logs',
      'SLA & onboarding',
      'Custom retention',
    ],
    cta: 'Talk to sales',
  },
] as const

export type NmCodeTab = {
  id: 'curl' | 'python' | 'javascript'
  label: string
  code: string
}

export const NM_CODE_SAMPLES: readonly NmCodeTab[] = [
  {
    id: 'curl',
    label: 'cURL',
    code: `curl https://api.nimbus.ai/v1/ask \\
  -H "Authorization: Bearer $NIMBUS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_id": "doc_8f3a",
    "question": "What is the renewal notice period?"
  }'`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `import requests

res = requests.post(
  "https://api.nimbus.ai/v1/ask",
  headers={"Authorization": f"Bearer {API_KEY}"},
  json={
    "document_id": "doc_8f3a",
    "question": "What is the renewal notice period?",
  },
)
print(res.json()["answer"])`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    code: `const res = await fetch("https://api.nimbus.ai/v1/ask", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.NIMBUS_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    document_id: "doc_8f3a",
    question: "What is the renewal notice period?",
  }),
});
const { answer } = await res.json();`,
  },
] as const

export type NmChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  meta?: string
}

export const NM_CHAT_MESSAGES: readonly NmChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    content:
      'From Acme_MSA_2024.pdf — what is the renewal notice period, and which section says so?',
  },
  {
    id: 'a1',
    role: 'assistant',
    content:
      'Either party may terminate for convenience with 60 days’ written notice before the renewal date. The term auto-renews for successive 12-month periods unless that notice is given.',
    meta: 'Cited · §7.2 Term & Renewal · p. 11',
  },
] as const

export type NmFooterLink = { label: string; href: string }

export const NM_FOOTER_LINKS: readonly NmFooterLink[] = [
  { label: 'Docs', href: '#docs' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Status', href: '#status' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
] as const

export const NM_FOOTER_COPY = '© 2026 Nimbus AI. Document answers you can verify.'
