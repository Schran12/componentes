/** HUELINE Saturation SS27 — catalogue data (mirrors public/hueline/catalog.js). */

export const HL_PALETTE = {
  Orchid: '#c2378a',
  Cobalt: '#2b3fd6',
  Marigold: '#f0a21a',
  Lagoon: '#13807a',
  Plum: '#3b1f3a',
  Poppy: '#e46d2f',
  Indigo: '#3a4a7a',
  Chalk: '#d9d6cf',
  Ink: '#16141a',
} as const

export type HlColourName = keyof typeof HL_PALETTE

export type HlStyleItemTuple = [
  name: string,
  fabric: string,
  price: number,
  colour: HlColourName | string,
  images: string[],
]

export type HlStyle = {
  code: string
  label: string
  tint: string
  items: HlStyleItemTuple[]
}

export const HL_STYLES: HlStyle[] = [
  {
    code: 'T',
    label: 'Tailoring',
    tint: '#2b3fd6',
    items: [
      ['Cobalt wrap overcoat', 'Double-faced cashmere', 62000, 'Cobalt', ['look-01']],
      ['Cobalt trouser suit', 'Super 120s wool', 54000, 'Cobalt', ['p-t-02']],
      ['Marigold soft blazer', 'Linen-silk, 210 g/m²', 33500, 'Marigold', ['p-t-03']],
      ['Chalk belted trench', 'Cotton gabardine', 41000, 'Chalk', ['p-t-04']],
    ],
  },
  {
    code: 'S',
    label: 'Streetwear',
    tint: '#13807a',
    items: [
      ['Dyed loop-back hoodie', 'Organic cotton, 420 g/m²', 9800, 'Lagoon', ['mood-street']],
      ['Lagoon fleece set', 'Brushed fleece', 10500, 'Lagoon', ['look-04']],
      ['Orchid boxy tee', 'Combed cotton, 240 g/m²', 4200, 'Orchid', ['p-s-03']],
      ['Poppy cargo trouser', 'Ripstop cotton', 12800, 'Poppy', ['p-s-04']],
    ],
  },
  {
    code: 'E',
    label: 'Evening',
    tint: '#c2378a',
    items: [
      ['Bias-cut slip dress', 'Mulberry silk, 19 momme', 29000, 'Orchid', ['look-02']],
      ['Cobalt column gown', 'Silk crepe de chine', 48000, 'Cobalt', ['p-e-02']],
      ['Orchid halter dress', 'Silk satin', 36500, 'Orchid', ['mood-evening']],
      ['Plum draped midi', 'Silk georgette', 31500, 'Plum', ['p-e-04']],
    ],
  },
  {
    code: 'K',
    label: 'Knitwear',
    tint: '#f0a21a',
    items: [
      ['Marigold cardigan set', 'Lambswool', 16800, 'Marigold', ['look-03']],
      ['Orchid ribbed crewneck', 'Merino, 12 gauge', 14500, 'Orchid', ['p-k-02']],
      ['Lagoon fine-knit polo', 'Cotton-silk', 11200, 'Lagoon', ['p-k-03']],
      ['Chalk cable vest', 'Undyed alpaca', 13900, 'Chalk', ['p-k-04']],
    ],
  },
  {
    code: 'R',
    label: 'Resort',
    tint: '#e46d2f',
    items: [
      [
        'Block-print shirt dress',
        'Hand-block cotton voile',
        18500,
        'Poppy',
        ['look-05', 'mood-resort'],
      ],
      ['Marigold tiered sundress', 'Cotton mulmul', 15500, 'Marigold', ['p-r-02']],
      ['Lagoon tiered maxi', 'Cotton voile', 17200, 'Lagoon', ['p-r-03']],
      ['Chalk wide-leg set', 'Linen, 180 g/m²', 21000, 'Chalk', ['p-r-04']],
    ],
  },
  {
    code: 'D',
    label: 'Denim',
    tint: '#3a4a7a',
    items: [
      ['Indigo trucker jacket', 'Indigo + cobalt overdye', 17900, 'Indigo', ['look-06']],
      ['Straight selvedge jean', '14 oz selvedge', 14900, 'Indigo', ['mood-denim']],
      ['Rinse wide-leg jean', '12 oz organic denim', 13500, 'Indigo', ['p-d-03']],
      ['Overdyed shirt dress', 'Indigo chambray', 16200, 'Cobalt', ['p-d-04']],
    ],
  },
]

export const HL_ASSETS = [
  'look-01',
  'look-02',
  'look-03',
  'look-04',
  'look-05',
  'look-06',
  'mood-street',
  'mood-evening',
  'mood-resort',
  'mood-denim',
  'dye-cobalt',
  'dye-marigold',
  'dye-orchid',
  'dye-lagoon',
  'atelier',
  'p-t-02',
  'p-t-03',
  'p-t-04',
  'p-s-03',
  'p-s-04',
  'p-e-02',
  'p-e-04',
  'p-k-02',
  'p-k-03',
  'p-k-04',
  'p-r-02',
  'p-r-03',
  'p-r-04',
  'p-d-03',
  'p-d-04',
  'hero-poster',
] as const

export const HL_VIDEOS = ['hero-close-1', 'hero-close-2'] as const

export type HlDyeSwatch = {
  key: string
  name: string
  bg: string
  fg: string
  ref: string
  recipe: string
  photo: string
  productCode: string
  notes: Record<string, string>
}

export const HL_DYE_SWATCHES: HlDyeSwatch[] = [
  {
    key: 'cobalt',
    name: 'Cobalt',
    bg: '#2b3fd6',
    fg: '#eceef2',
    ref: 'HL-04/01',
    recipe: 'Indigo vat, 3 dips',
    photo: 'dye-cobalt',
    productCode: 'HL-T-01',
    notes: { Base: 'Indigo vat', Fix: 'Alum mordant', Fastness: 'Grade 4–5 wash' },
  },
  {
    key: 'marigold',
    name: 'Marigold',
    bg: '#f0a21a',
    fg: '#16141a',
    ref: 'HL-04/02',
    recipe: 'Tagetes petals, alum',
    photo: 'dye-marigold',
    productCode: 'HL-K-01',
    notes: { Base: 'Tagetes', Fix: 'Alum', Fastness: 'Grade 3–4 light' },
  },
  {
    key: 'orchid',
    name: 'Orchid',
    bg: '#c2378a',
    fg: '#eceef2',
    ref: 'HL-04/03',
    recipe: 'Lac + madder',
    photo: 'dye-orchid',
    productCode: 'HL-E-01',
    notes: { Base: 'Lac', Fix: 'Copper mordant', Fastness: 'Grade 4 wash' },
  },
  {
    key: 'lagoon',
    name: 'Lagoon',
    bg: '#13807a',
    fg: '#eceef2',
    ref: 'HL-04/04',
    recipe: 'Indigo over pomegranate',
    photo: 'dye-lagoon',
    productCode: 'HL-S-02',
    notes: { Base: 'Pomegranate + indigo', Fix: 'Alum', Fastness: 'Grade 4–5' },
  },
]

export type HlLook = {
  num: string
  asset: string
  title: string
  copy: string
  productCode: string
}

export const HL_LOOKS: HlLook[] = [
  {
    num: '01',
    asset: 'look-01',
    title: 'Cobalt structure',
    copy: 'Double-faced cashmere cut sharp, dyed in three dips until the blue reads almost electric.',
    productCode: 'HL-T-01',
  },
  {
    num: '02',
    asset: 'look-02',
    title: 'Evening orchid',
    copy: 'Bias slip in 19 momme silk — the hem moves like water under Jaipur streetlight.',
    productCode: 'HL-E-01',
  },
  {
    num: '03',
    asset: 'look-03',
    title: 'Marigold knit',
    copy: 'Lambswool cardigan set, marigold from Bagru tagetes, paired with chalk alpaca.',
    productCode: 'HL-K-01',
  },
  {
    num: '04',
    asset: 'look-04',
    title: 'Lagoon fleece',
    copy: 'Brushed loop-back and fleece in lagoon green — streetwear washed in the same vat as tailoring.',
    productCode: 'HL-S-02',
  },
  {
    num: '05',
    asset: 'look-05',
    title: 'Resort block',
    copy: 'Hand-block voile dress; six days per print run, forty-eight pieces then the screen rests.',
    productCode: 'HL-R-01',
  },
  {
    num: '06',
    asset: 'look-06',
    title: 'Indigo denim',
    copy: '14 oz selvedge overdyed cobalt on the trucker — raw edge, saturated seam.',
    productCode: 'HL-D-01',
  },
]

export type HlProductView = {
  type: string
  asset: string
  pos: string
}

export type HlProduct = {
  code: string
  styleCode: string
  styleLabel: string
  styleTint: string
  name: string
  fabric: string
  price: number
  colour: string
  colourHex: string
  images: string[]
  views: HlProductView[]
}

export const HL_STYLE_ARCH_ASSETS = [
  'look-01',
  'look-02',
  'look-03',
  'look-04',
  'look-05',
  'look-06',
] as const

export const HL_ATELIER_STATS = [
  { value: 19, label: 'Momme weight of our mulberry silk' },
  { value: 48, label: 'Pieces cut per colourway, then the dye lot closes' },
  { value: 6, label: 'Days for one hand-block print run' },
] as const

export const HL_DEFAULT_ASSET_BASE = '/hueline/assets'

function hlPad(n: number) {
  return String(n).padStart(2, '0')
}

export function hlViewsForImages(images: string[]): HlProductView[] {
  const main = images[0]
  const list: HlProductView[] = [{ type: 'full', asset: main, pos: '50% 50%' }]
  list.push({ type: 'detail-upper', asset: main, pos: '50% 18%' })
  list.push({ type: 'detail-lower', asset: main, pos: '50% 82%' })
  if (images[1]) {
    list.push({ type: 'alt', asset: images[1], pos: '50% 50%' })
  }
  return list
}

export function hlBuildProducts(): HlProduct[] {
  const all: HlProduct[] = []
  HL_STYLES.forEach((style) => {
    style.items.forEach((item, idx) => {
      const [name, fabric, price, colour, images] = item
      const code = `HL-${style.code}-${hlPad(idx + 1)}`
      all.push({
        code,
        styleCode: style.code,
        styleLabel: style.label,
        styleTint: style.tint,
        name,
        fabric,
        price,
        colour,
        colourHex: HL_PALETTE[colour as HlColourName] || '#6a6773',
        images,
        views: hlViewsForImages(images),
      })
    })
  })
  return all
}

export const HL_ALL = hlBuildProducts()
export const HL_BY_CODE = Object.fromEntries(HL_ALL.map((p) => [p.code, p])) as Record<
  string,
  HlProduct
>

export function hlByCode(code: string): HlProduct {
  return HL_BY_CODE[code] ?? HL_BY_CODE['HL-T-01']
}

export function hlFormatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function hlSrc(name: string, ext?: string, base = HL_DEFAULT_ASSET_BASE) {
  if (name === 'hero-main') {
    return ext === 'poster' ? `${base}/hero-poster.jpg` : `/hueline/hero-main.${ext || 'webm'}`
  }
  if (name === 'dye-yard') {
    return `${base}/dye-yard.${ext || 'webm'}`
  }
  if ((HL_VIDEOS as readonly string[]).includes(name)) {
    return `${base}/${name}.${ext || 'webm'}`
  }
  if ((HL_ASSETS as readonly string[]).includes(name)) {
    if (ext === 'jpg' || !ext) return `${base}/${name}.jpg`
  }
  return `${base}/${name}.${ext || 'jpg'}`
}
