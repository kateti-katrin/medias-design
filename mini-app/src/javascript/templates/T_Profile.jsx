import React, { PureComponent } from 'react'

import O_PageHeader from '../components/O_PageHeader.jsx'
import A_Button from '../components/A_Button.jsx'
import A_Text from '../components/A_Text.jsx'

export default class T_Profile extends PureComponent {
  render() {
    const { user, handleLogout } = this.props

    return (
      <div className="T_Profile">
        <O_PageHeader headingText="Профиль" />

        <div className="T_Profile__row">
          <div className="T_Profile__label">Имя</div>
          <div className="T_Profile__value">
            {user && (user.name || user.email) ? user.name || user.email.split('@')[0] : '—'}
          </div>
        </div>

        <div className="T_Profile__row">
          <div className="T_Profile__label">Email</div>
          <div className="T_Profile__value">{user && user.email ? user.email : '—'}</div>
        </div>

        <div className="T_Profile__row">
          <div className="T_Profile__label">Статус</div>
          <div className="T_Profile__value">В смысле — с марта 2026</div>
        </div>

        <A_Button type="primary" full text="Выйти" handleClick={handleLogout} />

        <A_Text type="muted" text="СМЫСЛ — карманная версия для VK." />
      </div>
    )
  }
}
