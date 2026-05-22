import classnames from 'classnames'
import React, { PureComponent } from 'react'

import { utilities } from './utilities.js'

import T_SignIn from './javascript/templates/T_SignIn.jsx'
import T_Today from './javascript/templates/T_Today.jsx'
import T_References from './javascript/templates/T_References.jsx'
import T_Checklist from './javascript/templates/T_Checklist.jsx'
import T_Glossary from './javascript/templates/T_Glossary.jsx'
import T_Profile from './javascript/templates/T_Profile.jsx'

import O_Navigation from './javascript/components/O_Navigation.jsx'

/*
 * Концепция Mini App СМЫСЛ:
 * это «полевой набор заказчика дизайна» — то, что НЕ дублирует медиа,
 * а делает то, что удобно с телефона:
 *  - Сегодня — совет дня + быстрые действия
 *  - Референсы — фото-коллекция, можно снимать с камеры
 *  - Чек-лист — оценить макет за 2 минуты
 *  - Словарь — быстро глянуть незнакомый термин
 *  - Профиль — настройки (доступен из шапки)
 */
const PAGES = {
  signIn:     { name: 'signIn',     layout: 'L_CenteredForm', template: 'T_SignIn',     hideNav: true },
  today:      { name: 'today',      layout: 'L_InternalPage', template: 'T_Today' },
  references: { name: 'references', layout: 'L_InternalPage', template: 'T_References' },
  checklist:  { name: 'checklist',  layout: 'L_InternalPage', template: 'T_Checklist' },
  glossary:   { name: 'glossary',   layout: 'L_InternalPage', template: 'T_Glossary' },
  profile:    { name: 'profile',    layout: 'L_InternalPage', template: 'T_Profile',    hideNav: true }
}

const NAV_KEY_TO_PAGE = {
  today: PAGES.today,
  references: PAGES.references,
  checklist: PAGES.checklist,
  glossary: PAGES.glossary
}

export default class App extends PureComponent {
  constructor(props) {
    super(props)

    const token = utilities.getToken()
    const user = utilities.getUser()

    this.state = {
      page: token ? PAGES.today : PAGES.signIn,
      previousPage: PAGES.today,
      user,
      signInFormData: { email: '', password: '' },
      signInError: null
    }
  }

  // ───────────── Навигация ─────────────

  goTo = (page, extra = {}) => {
    this.setState({ page, ...extra })
  }

  handleNavigate = (key) => {
    const page = NAV_KEY_TO_PAGE[key]
    if (page) this.setState({ page, previousPage: page })
  }

  handleProfileClick = () => {
    this.setState({ previousPage: this.state.page, page: PAGES.profile })
  }

  handleProfileBack = () => {
    this.setState({ page: this.state.previousPage || PAGES.today })
  }

  handleQuickAction = (key) => {
    const page = NAV_KEY_TO_PAGE[key]
    if (page) this.setState({ page, previousPage: page })
  }

  // ───────────── Auth ─────────────

  handleSignInInput = (param, value) => {
    this.setState({
      signInFormData: { ...this.state.signInFormData, [param]: value }
    })
  }

  handleSignInSubmit = async () => {
    const { email, password } = this.state.signInFormData

    if (!email || !password) {
      this.setState({ signInError: 'Заполни email и пароль' })
      return
    }

    // Демо-режим: пускаем по любому email/паролю, без бэкенда.
    const fakeToken = 'demo-' + Math.random().toString(36).slice(2)
    const fakeUser = { email, display_name: email.split('@')[0] }

    utilities.setToken(fakeToken)
    utilities.setUser(fakeUser)

    this.setState({
      user: fakeUser,
      page: PAGES.today,
      previousPage: PAGES.today,
      signInFormData: { email: '', password: '' },
      signInError: null
    })
  }

  handleLogout = () => {
    utilities.clearToken()
    this.setState({
      user: null,
      page: PAGES.signIn,
      previousPage: PAGES.today
    })
  }

  // ───────────── Render ─────────────

  renderTemplate() {
    const { page, user } = this.state

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

      case 'T_Today':
        return (
          <T_Today
            user={user}
            handleProfileClick={this.handleProfileClick}
            handleQuickAction={this.handleQuickAction}
          />
        )

      case 'T_References':
        return (
          <T_References
            user={user}
            handleProfileClick={this.handleProfileClick}
          />
        )

      case 'T_Checklist':
        return (
          <T_Checklist
            user={user}
            handleProfileClick={this.handleProfileClick}
          />
        )

      case 'T_Glossary':
        return (
          <T_Glossary
            user={user}
            handleProfileClick={this.handleProfileClick}
          />
        )

      case 'T_Profile':
        return (
          <T_Profile
            user={user}
            handleLogout={this.handleLogout}
            handleBack={this.handleProfileBack}
          />
        )

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
