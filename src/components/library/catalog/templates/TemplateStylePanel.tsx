'use client'

import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SectionStyle } from './sectionCustomization'

function Group({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string
  hint?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition hover:bg-slate-50"
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-800">{title}</span>
          {hint ? <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span> : null}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-slate-400 transition', open && 'rotate-180')}
        />
      </button>
      {open ? <div className="space-y-3 border-t px-3 py-3">{children}</div> : null}
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-[11px] font-medium text-slate-600">{children}</p>
}

function ChoiceButtons({
  value,
  options,
  onChange,
}: {
  value: string
  options: readonly { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md border px-2 py-1.5 text-xs font-medium transition',
            value === option.value
              ? 'border-violet-500 bg-violet-50 text-violet-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function TemplateStylePanel({
  style,
  onChange,
  onClear,
}: {
  style: SectionStyle
  onChange: (patch: Partial<SectionStyle>) => void
  onClear: () => void
}) {
  const backgroundType = style.backgroundType ?? 'none'

  return (
    <div className="space-y-2">
      <p className="px-0.5 text-xs leading-5 text-slate-500">
        Ajuste a aparência desta seção. Abra só o grupo que precisa — as mudanças aparecem na prévia
        à esquerda.
      </p>

      <Group title="1. Fundo" hint="Cor sólida ou gradiente atrás do bloco" defaultOpen>
        <ChoiceButtons
          value={backgroundType === undefined ? 'none' : backgroundType}
          options={[
            { value: 'none', label: 'Nenhum' },
            { value: 'solid', label: 'Cor' },
            { value: 'gradient', label: 'Gradiente' },
          ]}
          onChange={(value) => {
            if (value === 'none') {
              onChange({
                backgroundType: undefined,
                background: undefined,
                gradientFrom: undefined,
                gradientTo: undefined,
                forceChildSurface: undefined,
              })
              return
            }
            if (value === 'solid') {
              onChange({
                backgroundType: 'solid',
                background: style.background || '#0f172a',
                forceChildSurface: false,
              })
              return
            }
            onChange({
              backgroundType: 'gradient',
              gradientFrom: style.gradientFrom || '#0f172a',
              gradientTo: style.gradientTo || '#7c3aed',
              gradientAngle: style.gradientAngle ?? 135,
              forceChildSurface: false,
            })
          }}
        />
        {backgroundType === 'solid' ? (
          <div>
            <Label>Cor do fundo</Label>
            <input
              type="color"
              value={style.background || '#0f172a'}
              onChange={(event) =>
                onChange({ background: event.target.value, forceChildSurface: false })
              }
              className="h-10 w-full cursor-pointer rounded-md border"
            />
          </div>
        ) : null}
        {backgroundType === 'gradient' ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Cor inicial</Label>
                <input
                  type="color"
                  value={style.gradientFrom || '#0f172a'}
                  onChange={(event) =>
                    onChange({ gradientFrom: event.target.value, forceChildSurface: false })
                  }
                  className="h-10 w-full cursor-pointer rounded-md border"
                />
              </div>
              <div>
                <Label>Cor final</Label>
                <input
                  type="color"
                  value={style.gradientTo || '#7c3aed'}
                  onChange={(event) =>
                    onChange({ gradientTo: event.target.value, forceChildSurface: false })
                  }
                  className="h-10 w-full cursor-pointer rounded-md border"
                />
              </div>
            </div>
            <div>
              <Label>Direção ({style.gradientAngle ?? 135}°)</Label>
              <input
                type="range"
                min={0}
                max={360}
                value={style.gradientAngle ?? 135}
                onChange={(event) =>
                  onChange({
                    gradientAngle: Number(event.target.value),
                    forceChildSurface: false,
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        ) : null}
        {backgroundType !== 'none' ? (
          <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={style.forceChildSurface === true}
              onChange={(event) => onChange({ forceChildSurface: event.target.checked })}
            />
            <span>
              Substituir o fundo interno do componente
              <span className="mt-0.5 block text-[11px] text-slate-400">
                Desligado por padrão — o componente mantém as cores originais.
              </span>
            </span>
          </label>
        ) : null}
      </Group>

      <Group title="2. Texto" hint="Cor geral dos títulos e parágrafos">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.textColor || '#0f172a'}
            onChange={(event) => onChange({ textColor: event.target.value })}
            className="h-10 w-14 cursor-pointer rounded-md border"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-700">Cor do texto</p>
            <button
              type="button"
              className="text-[11px] text-violet-600 underline"
              onClick={() => onChange({ textColor: undefined })}
            >
              Usar cor original
            </button>
          </div>
        </div>
      </Group>

      <Group title="3. Borda e cantos" hint="Contorno e arredondamento">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Espessura (px)</Label>
            <input
              type="number"
              min={0}
              max={16}
              value={style.borderWidth ?? 0}
              onChange={(event) => onChange({ borderWidth: Number(event.target.value) })}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <Label>Cor</Label>
            <input
              type="color"
              value={style.borderColor || '#c4b5fd'}
              onChange={(event) => onChange({ borderColor: event.target.value })}
              className="h-9 w-full cursor-pointer rounded-md border"
            />
          </div>
        </div>
        <div>
          <Label>Tipo de linha</Label>
          <select
            value={style.borderStyle || 'solid'}
            onChange={(event) =>
              onChange({ borderStyle: event.target.value as SectionStyle['borderStyle'] })
            }
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          >
            <option value="solid">Contínua</option>
            <option value="dashed">Tracejada</option>
            <option value="dotted">Pontilhada</option>
            <option value="none">Sem borda</option>
          </select>
        </div>
        <div>
          <Label>Cantos arredondados ({style.borderRadius ?? 0}px)</Label>
          <input
            type="range"
            min={0}
            max={48}
            value={style.borderRadius ?? 0}
            onChange={(event) => onChange({ borderRadius: Number(event.target.value) })}
            className="w-full"
          />
        </div>
      </Group>

      <Group title="4. Espaçamento interno" hint="Respiro dentro da seção">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Cima / baixo (px)</Label>
            <input
              type="number"
              min={0}
              max={120}
              value={style.paddingY ?? 0}
              onChange={(event) => onChange({ paddingY: Number(event.target.value) })}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <Label>Laterais (px)</Label>
            <input
              type="number"
              min={0}
              max={120}
              value={style.paddingX ?? 0}
              onChange={(event) => onChange({ paddingX: Number(event.target.value) })}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </Group>

      <Group title="5. Alinhamento" hint="Como o conteúdo se organiza">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Texto</Label>
            <select
              value={style.contentAlign || ''}
              onChange={(event) =>
                onChange({
                  contentAlign: (event.target.value || undefined) as
                    SectionStyle['contentAlign'] | undefined,
                })
              }
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">Padrão do bloco</option>
              <option value="start">Esquerda</option>
              <option value="center">Centro</option>
              <option value="end">Direita</option>
            </select>
          </div>
          <div>
            <Label>Distribuição</Label>
            <select
              value={style.contentJustify || ''}
              onChange={(event) =>
                onChange({
                  contentJustify: (event.target.value || undefined) as
                    SectionStyle['contentJustify'] | undefined,
                })
              }
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">Padrão do bloco</option>
              <option value="start">Início</option>
              <option value="center">Centro</option>
              <option value="end">Fim</option>
              <option value="between">Espaçar</option>
            </select>
          </div>
        </div>
      </Group>

      <Group title="6. Posição e opacidade" hint="Deslocar ou suavizar a seção">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Horizontal ({style.offsetX ?? 0}px)</Label>
            <input
              type="range"
              min={-80}
              max={80}
              value={style.offsetX ?? 0}
              onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <Label>Vertical ({style.offsetY ?? 0}px)</Label>
            <input
              type="range"
              min={-80}
              max={80}
              value={style.offsetY ?? 0}
              onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <Label>Opacidade ({style.opacity ?? 100}%)</Label>
          <input
            type="range"
            min={20}
            max={100}
            value={style.opacity ?? 100}
            onChange={(event) => onChange({ opacity: Number(event.target.value) })}
            className="w-full"
          />
        </div>
      </Group>

      <Group title="7. Sombra e largura" hint="Destaque e contenção">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sombra</Label>
            <select
              value={style.shadow || 'none'}
              onChange={(event) =>
                onChange({ shadow: event.target.value as SectionStyle['shadow'] })
              }
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="none">Nenhuma</option>
              <option value="sm">Leve</option>
              <option value="md">Média</option>
              <option value="lg">Forte</option>
              <option value="xl">Muito forte</option>
            </select>
          </div>
          <div>
            <Label>Largura máxima</Label>
            <select
              value={style.maxWidth || 'full'}
              onChange={(event) =>
                onChange({ maxWidth: event.target.value as SectionStyle['maxWidth'] })
              }
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="full">Tela toda</option>
              <option value="7xl">Larga</option>
              <option value="6xl">Média</option>
              <option value="5xl">Estreita</option>
            </select>
          </div>
        </div>
      </Group>

      <Button type="button" size="sm" variant="outline" className="w-full" onClick={onClear}>
        Limpar todos os estilos
      </Button>
    </div>
  )
}
