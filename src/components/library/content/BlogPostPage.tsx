import {
  ArticleLayout,
  type ArticleBlock,
  type ArticleLayoutProps,
} from '@/components/library/content/ArticleLayout'
import { BlogGrid, type BlogGridProps } from '@/components/library/data-display/BlogGrid'
import { HeroImage } from '@/components/library/marketing/HeroImage'
import { HeroSplit } from '@/components/library/marketing/HeroSplit'
import { PageHeader } from '@/components/library/marketing/PageHeader'

export type BlogPostContent = {
  title: string
  excerpt?: string
  category?: string
  author?: string
  image: { src: string; alt: string }
  date: { label: string; dateTime: string }
  body: ArticleBlock[]
  quote?: string
}

export type BlogPostPageProps = {
  post: BlogPostContent
  /**
   * - `classic`: cabeçalho, imagem e texto em coluna única.
   * - `cover`: capa em tela cheia com o título sobre a imagem.
   * - `sidebar`: texto com barra lateral fixa (dados, índice e chamada).
   * - `magazine`: banner dividido, abertura em destaque, seções numeradas e citação.
   */
  layout?: 'classic' | 'cover' | 'sidebar' | 'magazine'
  breadcrumbs?: Array<{ label: string; href?: string }>
  related?: BlogGridProps['posts']
  relatedTitle?: string
  labels?: ArticleLayoutProps['labels']
  aside?: ArticleLayoutProps['aside']
  className?: string
}

export function BlogPostPage({
  post,
  layout = 'classic',
  breadcrumbs,
  related = [],
  relatedTitle = 'Leia também',
  labels,
  aside,
  className,
}: BlogPostPageProps) {
  const header =
    layout === 'cover' ? (
      <HeroImage
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        image={post.image}
        align="center"
      />
    ) : layout === 'magazine' ? (
      <HeroSplit
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        image={post.image}
        imagePosition="left"
      />
    ) : (
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={breadcrumbs}
        size="compact"
        variant={breadcrumbs?.length ? 'primary' : 'muted'}
      />
    )

  return (
    <div className={className}>
      {header}
      <ArticleLayout
        variant={layout}
        body={post.body}
        date={post.date}
        image={post.image}
        author={post.author}
        category={post.category}
        quote={post.quote}
        labels={labels}
        aside={aside}
      />
      {related.length ? (
        <BlogGrid title={relatedTitle} posts={related.slice(0, 3)} className="bg-muted/40" />
      ) : null}
    </div>
  )
}
