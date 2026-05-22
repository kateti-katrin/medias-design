import classnames from 'classnames'
import React, { PureComponent } from 'react'

import { utilities } from './utilities.js'

import T_SignIn from './javascript/templates/T_SignIn.jsx'
import T_Articles from './javascript/templates/T_Articles.jsx'
import T_Article from './javascript/templates/T_Article.jsx'
import T_Brief from './javascript/templates/T_Brief.jsx'
import T_Profile from './javascript/templates/T_Profile.jsx'

import O_Navigation from './javascript/components/O_Navigation.jsx'

// Минимальный собственный «роутер» — как у Захара.
// Страница описывается { name, layout, template, hideNav? }
const PAGES = {
  signIn:   { name: 'signIn',   layout: 'L_CenteredForm', template: 'T_SignIn',  hideNav: true },
  articles: { name: 'articles', layout: 'L_InternalPage', template: 'T_Articles' },
  article:  { name: 'article',  layout: 'L_InternalPage', template: 'T_Article' },
  brief:    { name: 'brief',    layout: 'L_InternalPage', template: 'T_Brief' },
  profile:  { name: 'profile',  layout: 'L_InternalPage', template: 'T_Profile' }
}

const NAV_KEY_TO_PAGE = {
  articles: PAGES.articles,
  brief: PAGES.brief,
  profile: PAGES.profile
}

export default class App extends PureComponent {
  constructor(props) {
    super(props)

    const token = utilities.getToken()
    const user = utilities.getUser()

    this.state = {
      page: token ? PAGES.articles : PAGES.signIn,
      user,
      // sign-in form
      signInFormData: { email: '', password: '' },
      signInError: null,
      // articles
      articles: null,
      articlesLoading: false,
      // single article
      currentArticleId: null,
      currentArticle: null,
      articleLoading: false
    }
  }

  // ───────────────────────── Навигация ─────────────────────────

  goTo = (page, extra = {}) => {
    this.setState({ page, ...extra })
  }

  handleNavigate = (key) => {
    const page = NAV_KEY_TO_PAGE[key]
    if (page) this.goTo(page)
  }

  // ───────────────────────── Sign in ─────────────────────────

  handleSignInInput = (param, value) => {
    this.setState({
      signInFormData: { ...this.state.signInFormData, [param]: value }
    })
  }

  handleSignInSubmit = async () => {
    const { email, password } = this.state.signInFormData

    this.setState({ signInError: null })

    // ── ДЕМО-РЕЖИМ ──────────────────────────────────────────────
    // На предпросмотре Rails ещё не задеплоен в продакшен.
    // Чтобы Mini App работал автономно, пускаем по любым email/паролю.
    // localStorage хранит fake-токен и юзера — после reload пускает дальше.
    if (!email || !password) {
      this.setState({ signInError: 'Заполни email и пароль' })
      return
    }

    const fakeToken = 'demo-' + Math.random().toString(36).slice(2)
    const fakeUser = { email: email, display_name: email.split('@')[0] }

    utilities.setToken(fakeToken)
    utilities.setUser(fakeUser)

    this.setState({
      user: fakeUser,
      page: PAGES.articles,
      signInFormData: { email: '', password: '' }
    })
  }

  handleLogout = async () => {
    await utilities.fetchAPI(utilities.apiPaths.logout, { method: 'DELETE' })
    utilities.clearToken()
    this.setState({
      user: null,
      page: PAGES.signIn,
      articles: null,
      currentArticle: null
    })
  }

  // ───────────────────────── Articles ─────────────────────────

  initArticlesPage = async () => {
    if (this.state.articles) return
    this.setState({ articlesLoading: true })

    const { ok, data } = await utilities.fetchAPI(utilities.apiPaths.articles)

    // Rails-эндпоинт возвращает { data: [...] }
    const list = (data && (data.data || data.articles)) || []

    this.setState({
      articles: ok ? list : [],
      articlesLoading: false
    })
  }

  handleArticleShow = (idOrSlug) => {
    this.setState({
      currentArticleId: idOrSlug,
      currentArticle: null,
      page: PAGES.article
    })
  }

  initArticlePage = async (idOrSlug) => {
    this.setState({ articleLoading: true })

    const { ok, data } = await utilities.fetchAPI(
      utilities.apiPaths.article(idOrSlug)
    )

    const article = (data && (data.data || data.article)) || null

    this.setState({
      currentArticle: ok ? article : null,
      articleLoading: false
    })
  }

  handleArticleBack = () => {
    this.goTo(PAGES.articles, { currentArticle: null, currentArticleId: null })
  }

  // ───────────────────────── Render ─────────────────────────

  renderTemplate() {
    const { page } = this.state

    switch (page.template) {
      case 'T_SignIn':
        return (
          <T_SignIn
            formData={this.state.signInFormData}
            error={this.state.signInError}
            actions={{
              handleInput: this.handleSignInInput,
              handleFormSubmit: this.handleSignInSubmit
            }}
          />
        )

      case 'T_Articles':
        return (
          <T_Articles
            articles={this.state.articles}
            loading={this.state.articlesLoading}
            initArticlesPage={this.initArticlesPage}
            handleArticleShow={this.handleArticleShow}
          />
        )

      case 'T_Article':
        return (
          <T_Article
            articleId={this.state.currentArticleId}
            article={this.state.currentArticle}
            loading={this.state.articleLoading}
            initArticlePage={this.initArticlePage}
            handleBack={this.handleArticleBack}
          />
        )

      case 'T_Brief':
        return <T_Brief />

      case 'T_Profile':
        return <T_Profile user={this.state.user} handleLogout={this.handleLogout} />

      default:
        return null
    }
  }

  render() {
    const { page } = this.state
    const className = classnames('App', page.layout)

    return (
      <div className={className}>
        {this.renderTemplate()}

        {!page.hideNav && (
          <O_Navigation
            current={page.name}
            handleNavigate={this.handleNavigate}
          />
        )}
      </div>
    )
  }
}
