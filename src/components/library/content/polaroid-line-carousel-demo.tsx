'use client'

import { DEMO_ORIGIN } from '@/lib/demoOrigin'
import PolaroidLineCarousel from './PolaroidLineCarousel'
import type { PolaroidLineCarouselProps, Slide } from './PolaroidLineCarousel'

function defaultPhotosBase() {
  if (
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
  ) {
    return '/polaroid-line-carousel'
  }
  return `${DEMO_ORIGIN}/polaroid-line-carousel`
}

/**
 * Seis fotos de paisagem num varal, ocupando a tela inteira. As fotos (quadradas, em WebP) ficam na pasta
 * public/polaroid-line-carousel do projeto; photos troca essa pasta (um basePath do Next.js, um CDN). As outras props
 * vão direto para o carrossel.
 */
export const demoSlides = (photos = defaultPhotosBase()): Slide[] => [
  {
    image: `${photos}/acima-das-nuvens.webp`,
    title: 'Acima das nuvens',
    caption: 'Valais, Suíça: o nascer do sol a 3.100 m.',
  },
  {
    image: `${photos}/lago-de-vidro.webp`,
    title: 'Lago de vidro',
    caption: 'Lago di Braies, um barco a remo ao meio-dia.',
  },
  {
    image: `${photos}/vale-dourado.webp`,
    title: 'Vale dourado',
    caption: 'A luz do fim da tarde descendo pela serra.',
  },
  {
    image: `${photos}/linha-da-neve.webp`,
    title: 'Linha da neve',
    caption: 'Pinheiros, o leito do rio e a serra alta.',
  },
  {
    image: `${photos}/serras-azuis.webp`,
    title: 'Serras azuis',
    caption: 'Sete camadas de névoa antes do anoitecer.',
  },
  {
    image: `${photos}/ponte-da-cascata.webp`,
    title: 'Ponte da cascata',
    caption: 'Multnomah Falls depois da chuva.',
  },
]

export default function PolaroidLineCarouselDemo({
  photos,
  ...props
}: { photos?: string } & PolaroidLineCarouselProps) {
  return <PolaroidLineCarousel slides={demoSlides(photos)} {...props} />
}
