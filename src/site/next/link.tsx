import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type Url = string | { pathname?: string; query?: Record<string, string>; hash?: string }

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: Url
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  legacyBehavior?: boolean
  locale?: string | false
}

function toHref(url: Url) {
  if (typeof url === 'string') return url
  const query = url.query ? `?${new URLSearchParams(url.query)}` : ''
  return `${url.pathname ?? ''}${query}${url.hash ?? ''}`
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, ...props },
  ref,
) {
  const target = toHref(href)
  if (target.startsWith('/') && !target.startsWith('//')) {
    return <RouterLink ref={ref} to={target} replace={replace} {...props} />
  }
  return <a ref={ref} href={target} {...props} />
})

export default Link
