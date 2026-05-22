import React, { PureComponent } from 'react'

import O_PageHeader from '../components/O_PageHeader.jsx'
import M_ArticleCard from '../components/M_ArticleCard.jsx'
import A_Text from '../components/A_Text.jsx'

export default class T_Articles extends PureComponent {
  componentDidMount() {
    const { initArticlesPage } = this.props
    if (initArticlesPage) initArticlesPage()
  }

  render() {
    const { articles, loading, handleArticleShow } = this.props

    return (
      <div className="T_Articles">
        <O_PageHeader headingText="Статьи" />

        <div className="T_Articles__list">
          {loading && (
            <div className="T_Articles__empty">
              <A_Text type="muted" text="Грузим смыслы…" />
            </div>
          )}

          {!loading && (!articles || articles.length === 0) && (
            <div className="T_Articles__empty">
              <A_Text type="muted" text="Пока пусто. Возвращайтесь в смысле позже." />
            </div>
          )}

          {!loading &&
            articles &&
            articles.map((article) => (
              <M_ArticleCard
                key={article.id}
                article={article}
                handleClick={handleArticleShow}
              />
            ))}
        </div>
      </div>
    )
  }
}
