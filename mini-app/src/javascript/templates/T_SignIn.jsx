import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import O_Form from '../components/O_Form.jsx'

const FIELDS = [
  {
    label: 'Электронная почта',
    name: 'user_email',
    param: 'email',
    type: 'email',
    placeholder: 'you@example.com'
  },
  {
    label: 'Пароль',
    name: 'user_password',
    param: 'password',
    type: 'password',
    placeholder: '••••••••'
  }
]

const BUTTONS = [{ type: 'primary', text: 'Войти в смысл' }]

export default class T_SignIn extends PureComponent {
  render() {
    const { formData, actions, error } = this.props

    return (
      <div className="T_SignIn">
        <div className="T_SignIn__intro">
          <A_Text type="display-heading-1" text="СМЫСЛ" />
          <A_Text
            type="muted"
            html="Карманное медиа о&nbsp;дизайне для предпринимателей, маркетологов и&nbsp;проджектов. В&nbsp;смысле с&nbsp;марта 2026."
          />
        </div>

        <O_Form
          fields={FIELDS}
          buttons={BUTTONS}
          formData={formData}
          actions={actions}
          error={error}
        />

        <div className="T_SignIn__hint">
          <A_Text type="muted" text="Без аккаунта пока никуда — это бета." />
        </div>
      </div>
    )
  }
}
