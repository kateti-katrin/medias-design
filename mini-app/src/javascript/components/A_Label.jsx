import React, { PureComponent } from 'react'

export default class A_Label extends PureComponent {
  render() {
    const { name, label } = this.props
    return (
      <label className="A_Label" htmlFor={name}>
        {label}
      </label>
    )
  }
}
