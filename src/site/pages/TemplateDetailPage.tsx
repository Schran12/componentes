import { Navigate, useParams } from 'react-router-dom'
import { getLayoutRecipe } from '@/components/library/catalog/layoutRecipes'

/** Templates abrem no montador — sem editor visual estilo WordPress. */
export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const recipe = id ? getLayoutRecipe(id) : undefined

  if (!recipe) {
    return <Navigate to="/templates" replace />
  }

  return <Navigate to={`/montar-pagina?recipe=${recipe.id}`} replace />
}
