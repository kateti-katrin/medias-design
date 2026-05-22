import React, { PureComponent } from 'react'

import A_Label from './A_Label.jsx'
import A_Input from './A_Input.jsx'

export default class M_Field extends PureComponent {
  render() {
    const { label, name, param, type, placeholder, value, multiline, actions } = this.props

    return (
      <div className="M_Field">
        {label && <A_Label name={name} label={label} />}
        <A_Input
          name={name}
          type={type}
          multiline={multiline}
          placeholder={placeholder}
          value={value}
          param={param}
          handleInput={actions && actions.handleInput}
        />
      </div>
    )
  }
}
