import React, { PureComponent } from 'react'

import A_Button from './A_Button.jsx'
import M_Field from './M_Field.jsx'

export default class O_Form extends PureComponent {
  render() {
    const { fields, buttons, formData, actions, error } = this.props

    return (
      <div className="O_Form">
        {fields.map((field) => (
          <M_Field
            {...field}
            value={formData ? formData[field.param] : ''}
            actions={actions}
            key={field.name}
          />
        ))}

        {error && <div className="O_Form__error">{error}</div>}

        {buttons.map((button) => (
          <A_Button
            {...button}
            full
            handleClick={
              button.type === 'primary' ? actions.handleFormSubmit : button.handleClick
            }
            key={button.text}
          />
        ))}
      </div>
    )
  }
}
