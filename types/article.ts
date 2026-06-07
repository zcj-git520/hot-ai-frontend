/**
 * 文章实体 - 来自 content-svc /api/articles/:id
 *
 * 字段多为可空：后端可能省略空值或老数据缺字段
 */
export interface Article {
  id: string | number
  title: string
  summary?: string
  /** 纯文本 + Markdown 混排，详见 useArticleRender */
  content?: string
  category_name?: string
  category_code?: string
  source_name?: string
  author?: string
  published_at?: string
  view_count?: number
  comment_count?: number
  like_count?: number
  tags?: string[]
  original_url?: string
}
