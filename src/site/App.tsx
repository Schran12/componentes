import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './SiteLayout'
import { AnimationsPage } from './pages/AnimationsPage'
import { AssistantPage } from './pages/AssistantPage'
import { BuildPage } from './pages/BuildPage'
import { ComponentDetailPage } from './pages/ComponentDetailPage'
import { ComponentsPage } from './pages/ComponentsPage'
import { InstallationGuidePage } from './pages/InstallationGuidePage'
import { TemplateDetailPage } from './pages/TemplateDetailPage'
import { TemplatesPage } from './pages/TemplatesPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  return (
    <SiteLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/componentes" replace />} />
        <Route path="/componentes" element={<ComponentsPage />} />
        <Route path="/componentes/:id" element={<ComponentDetailPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />
        <Route path="/animacoes" element={<AnimationsPage />} />
        <Route path="/montar-pagina" element={<BuildPage />} />
        <Route path="/assistente" element={<AssistantPage />} />
        <Route path="/como-utilizar" element={<InstallationGuidePage />} />
        <Route path="*" element={<Navigate to="/componentes" replace />} />
      </Routes>
    </SiteLayout>
  )
}
