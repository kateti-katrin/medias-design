import classnames from 'classnames'
import React, { PureComponent } from 'react'

export default class A_Text extends PureComponent {
  render() {
    const { type, text, html, children } = this.props

    const classes = classnames({
      A_Text: true,
      [type]: !!type
    })

    if (html) {
      return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />
    }

    return <div className={classes}>{text || children}</div>
  }
}
