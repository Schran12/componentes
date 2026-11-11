/**
 * Temas visuais compartilhados pelos componentes de origem dos templates Next.
 * - glow: fundo escuro com gradiente rosa/roxo.
 * - industrial: fundo claro com destaque âmbar.
 * - industrial-dark: fundo slate escuro com destaque âmbar.
 */
export type AccentTone = 'glow' | 'industrial' | 'industrial-dark'

export type AccentToneTokens = {
  section: string
  alt: string
  panel: string
  panelHover: string
  border: string
  divide: string
  heading: string
  strong: string
  body: string
  muted: string
  accent: string
  line: string
  fill: string
  onFill: string
  iconButton: string
  radius: string
  overlayFrom: string
  chip: string
  focus: string
  hoverLift: string
  input: string
  error: string
}

export const accentTones: Record<AccentTone, AccentToneTokens> = {
  glow: {
    section: 'bg-[#121212] text-[#c1c1c1]',
    alt: 'bg-[#0e0e0e] text-[#c1c1c1]',
    panel: 'bg-[#221d2f]',
    panelHover: 'hover:bg-[#2a2339]',
    border: 'border-[#493849]',
    divide: 'divide-[#493849]',
    heading:
      'w-fit bg-gradient-to-r from-[#c642a5] to-[#7c39cf] bg-clip-text font-normal text-transparent',
    strong: 'text-white',
    body: 'text-[#c1c1c1]',
    muted: 'text-[#c1c1c1]/75',
    accent: 'text-[#ffb0eb]',
    line: 'bg-gradient-to-r from-[#c642a5] to-[#7c39cf]',
    fill: 'bg-gradient-to-br from-[#c642a5] to-[#7c39cf]',
    onFill: 'text-white',
    iconButton:
      'rounded-full border border-[#493849] text-white hover:border-[#c642a5] hover:bg-[#c642a5]',
    radius: 'rounded-2xl',
    overlayFrom: 'from-[#121212]',
    chip: 'border-[#493849] bg-[#121212]/70',
    focus:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c642a5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]',
    hoverLift:
      'hover:-translate-y-1 hover:border-[#c642a5]/50 hover:shadow-[0_12px_40px_rgba(198,66,165,0.18)]',
    input:
      'rounded-md border-[#493849] bg-[#221d2f] text-white placeholder:text-[#c1c1c1]/70 focus-visible:ring-[#c642a5]',
    error: 'text-red-400',
  },
  industrial: {
    section: 'bg-slate-50 text-slate-600',
    alt: 'bg-white text-slate-600',
    panel: 'bg-white',
    panelHover: 'hover:bg-slate-50',
    border: 'border-slate-200',
    divide: 'divide-slate-200',
    heading: 'font-semibold uppercase tracking-wide text-slate-900',
    strong: 'text-slate-900',
    body: 'text-slate-600',
    muted: 'text-slate-500',
    accent: 'text-amber-600',
    line: 'bg-amber-500',
    fill: 'bg-amber-500',
    onFill: 'text-slate-950',
    iconButton:
      'border border-slate-300 text-slate-700 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950',
    radius: 'rounded-none',
    overlayFrom: 'from-slate-950',
    chip: 'border-white/15 bg-slate-950/50',
    focus:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    hoverLift: 'hover:border-amber-500/60',
    input:
      'rounded-sm border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-500',
    error: 'text-red-600',
  },
  'industrial-dark': {
    section: 'bg-slate-950 text-slate-400',
    alt: 'bg-slate-900 text-slate-400',
    panel: 'bg-slate-900',
    panelHover: 'hover:bg-white/5',
    border: 'border-white/10',
    divide: 'divide-white/10',
    heading: 'font-semibold uppercase tracking-wide text-white',
    strong: 'text-white',
    body: 'text-slate-400',
    muted: 'text-slate-500',
    accent: 'text-amber-500',
    line: 'bg-amber-500',
    fill: 'bg-amber-500',
    onFill: 'text-slate-950',
    iconButton:
      'border border-white/20 text-white hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950',
    radius: 'rounded-none',
    overlayFrom: 'from-slate-950',
    chip: 'border-white/10 bg-slate-950/40',
    focus:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
    hoverLift: 'hover:border-amber-500/60',
    input:
      'rounded-sm border-white/10 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:ring-amber-500',
    error: 'text-red-400',
  },
}

export function getAccentTone(tone: AccentTone = 'glow'): AccentToneTokens {
  return accentTones[tone]
}

export function padIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}
