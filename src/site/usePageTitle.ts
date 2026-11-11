import { useEffect } from 'react'

const siteName = 'Componentes Bloomin'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${siteName}`
  }, [title])
}
