import classnames from 'classnames'
import React, { PureComponent } from 'react'

export default class A_Button extends PureComponent {
  render() {
    const { type, text, disabled, full, handleClick } = this.props

    const classes = classnames({
      A_Button: true,
      [type]: !!type,
      full: !!full,
      disabled: !!disabled
    })

    return (
      <button
        type="button"
        className={classes}
        disabled={disabled}
        onClick={() => {
          if (!disabled && handleClick) handleClick()
        }}
      >
        {text}
      </button>
    )
  }
}
