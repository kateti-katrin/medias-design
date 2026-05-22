import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import A_Button from '../components/A_Button.jsx'
import O_PageHeader from '../components/O_PageHeader.jsx'

export default class T_Profile extends PureComponent {
  state = {
    notifications: true,
    saveHistory: true,
    publicProfile: false
  }

  toggle = (key) => () => {
    this.setState({ [key]: !this.state[key] })
  }

  render() {
    const { user, handleLogout, handleBack } = this.props
    const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : 'СМ'
    const displayName = (user && (user.display_name || user.email)) || 'Гость'

    return (
      <div className="T_Profile">
        <O_PageHeader
          overlineText="[ настройки ]"
          headingText="Профиль"
          hideProfile
        />

        <div className="T_Profile__body">

          <section className="T_Profile__hero">
            <div className="T_Profile__avatar">{initials}</div>
            <div className="T_Profile__id">
              <p className="T_Profile__name">{displayName}</p>
              <p className="T_Profile__role">в&nbsp;смысле</p>
            </div>
          </section>

          <section className="T_Profile__section">
            <A_Text type="overline" text="[ что показывать ]" />

            <div className="T_Profile__row" onClick={this.toggle('notifications')}>
              <div className="T_Profile__row-text">
                <p className="T_Profile__row-title">Уведомления</p>
                <p className="T_Profile__row-hint">Новый совет дня и&nbsp;статьи</p>
              </div>
              <span className={'T_Profile__switch' + (this.state.notifications ? ' is-on' : '')}>
                <span className="T_Profile__switch-knob" />
              </span>
            </div>

            <div className="T_Profile__row" onClick={this.toggle('saveHistory')}>
              <div className="T_Profile__row-text">
                <p className="T_Profile__row-title">Сохранять историю</p>
                <p className="T_Profile__row-hint">Референсы и&nbsp;чек-листы</p>
              </div>
              <span className={'T_Profile__switch' + (this.state.saveHistory ? ' is-on' : '')}>
                <span className="T_Profile__switch-knob" />
              </span>
            </div>

            <div className="T_Profile__row" onClick={this.toggle('publicProfile')}>
              <div className="T_Profile__row-text">
                <p className="T_Profile__row-title">Публичный профиль</p>
                <p className="T_Profile__row-hint">Видно другим читателям медиа</p>
              </div>
              <span className={'T_Profile__switch' + (this.state.publicProfile ? ' is-on' : '')}>
                <span className="T_Profile__switch-knob" />
              </span>
            </div>
          </section>

          <section className="T_Profile__section">
            <A_Text type="overline" text="[ полная версия ]" />
            <a
              className="T_Profile__media-link"
              href="https://kateti-katrin.github.io/medias-design/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Открыть медиа в&nbsp;браузере</span>
              <span aria-hidden="true">↗</span>
            </a>
          </section>

          <section className="T_Profile__section T_Profile__section--actions">
            {handleBack && (
              <A_Button text="Назад" handleClick={handleBack} />
            )}
            <A_Button type="primary" text="Выйти" handleClick={handleLogout} />
          </section>

          <p className="T_Profile__legal">СМЫСЛ Mini App · в&nbsp;смысле с&nbsp;марта 2026</p>
        </div>
      </div>
    )
  }
}
