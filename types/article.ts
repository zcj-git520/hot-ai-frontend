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

  // ===== 访问控制 (由后端 access 引擎在响应时填充) =====
  access_level?: number           // DB 字段：0=游客 1=登录 2=会员
  is_locked?: boolean             // 访问级别不足时为 true
  required_level?: number         // 需要的最低 level
  required_level_name?: string    // "游客" / "普通用户" / "会员"
  locked?: {                      // 不够级别时返回的占位卡
    is_locked: boolean
    required_level: number
    required_level_name: string
    title: string
    message: string
    cta: string                   // "登录后阅读" / "升级会员"
  }
}
