import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from 'react'

export type StaticImageData = { src: string; width: number; height: number }

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  src: string | StaticImageData
  alt: string
  width?: number | `${number}`
  height?: number | `${number}`
  fill?: boolean
  priority?: boolean
  quality?: number | `${number}`
  placeholder?: string
  blurDataURL?: string
  unoptimized?: boolean
  loader?: unknown
  onLoadingComplete?: (image: HTMLImageElement) => void
}

const fillStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    width,
    height,
    fill,
    priority,
    quality,
    placeholder,
    blurDataURL,
    unoptimized,
    loader,
    onLoadingComplete,
    style,
    loading,
    ...props
  },
  ref,
) {
  const source = typeof src === 'string' ? src : src.src
  return (
    <img
      ref={ref}
      src={source}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      decoding="async"
      style={fill ? { ...fillStyle, ...style } : style}
      onLoad={onLoadingComplete ? (event) => onLoadingComplete(event.currentTarget) : undefined}
      {...props}
    />
  )
})

export default Image
