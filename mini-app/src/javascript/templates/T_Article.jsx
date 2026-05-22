import React, { PureComponent } from 'react'

import O_PageHeader from '../components/O_PageHeader.jsx'
import A_Text from '../components/A_Text.jsx'

export default class T_Article extends PureComponent {
  componentDidMount() {
    const { initArticlePage, articleId } = this.props
    if (initArticlePage && articleId) initArticlePage(articleId)
  }

  render() {
    const { article, loading, handleBack } = this.props

    return (
      <div className="T_Article">
        <O_PageHeader
          headingText="Статья"
          buttonText="Назад"
          handleClick={handleBack}
        />

        <div className="T_Article__body">
          {loading && <A_Text type="muted" text="Открываем смысл…" />}

          {!loading && !article && (
            <A_Text type="muted" text="Не нашли. В смысле — совсем." />
          )}

          {article && (
            <>
              {article.tag && (
                <div className="T_Article__tag">{article.tag}</div>
              )}
              <div className="T_Article__title">
                <A_Text type="display-heading-1" text={article.title} />
              </div>
              <div className="T_Article__meta">
                {typeof article.views_count === 'number' && (
                  <span>{article.views_count} просмотров</span>
                )}
                {typeof article.likes_count === 'number' && (
                  <span>{article.likes_count} лайков</span>
                )}
              </div>
              {article.body && (
                <A_Text type="article-body" html={article.body} />
              )}
              {!article.body && article.excerpt && (
                <A_Text type="body" text={article.excerpt} />
              )}
            </>
          )}
        </div>
      </div>
    )
  }
}
