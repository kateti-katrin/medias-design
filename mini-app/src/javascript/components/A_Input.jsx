import React, { PureComponent } from 'react'

export default class A_Input extends PureComponent {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  handleInput = () => {
    const { param, handleInput } = this.props
    if (!handleInput) return
    handleInput(param, this.input.current.value)
  }

  render() {
    const { type, placeholder, value, multiline, name } = this.props

    if (multiline) {
      return (
        <textarea
          ref={this.input}
          className="A_Input"
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onInput={this.handleInput}
          onChange={this.handleInput}
        />
      )
    }

    return (
      <input
        ref={this.input}
        className="A_Input"
        name={name}
        type={type || 'text'}
        placeholder={placeholder}
        value={value || ''}
        onInput={this.handleInput}
        onChange={this.handleInput}
      />
    )
  }
}
