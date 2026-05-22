import React, { PureComponent } from 'react'

export default class M_ArticleCard extends PureComponent {
  render() {
    const { article, handleClick } = this.props
    if (!article) return null

    const { id, slug, title, excerpt, tag, views_count, likes_count, comments_count } = article

    return (
      <div
        className="M_ArticleCard"
        onClick={() => handleClick && handleClick(slug || id)}
      >
        {tag && <div className="M_ArticleCard__tag">{tag}</div>}
        <div className="M_ArticleCard__title">{title}</div>
        {excerpt && <div className="M_ArticleCard__excerpt">{excerpt}</div>}
        <div className="M_ArticleCard__meta">
          {typeof views_count === 'number' && <span>{views_count} просмотров</span>}
          {typeof likes_count === 'number' && <span>{likes_count} лайков</span>}
          {typeof comments_count === 'number' && <span>{comments_count} комментариев</span>}
        </div>
      </div>
    )
  }
}
