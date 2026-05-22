import React, { PureComponent } from 'react'

import A_Text from './A_Text.jsx'
import A_Button from './A_Button.jsx'

export default class O_PageHeader extends PureComponent {
  render() {
    const { headingText, buttonText, handleClick } = this.props

    return (
      <div className="O_PageHeader">
        <A_Text type="display-heading-1" text={headingText} />
        {buttonText && (
          <A_Button type="tertiary" text={buttonText} handleClick={handleClick} />
        )}
      </div>
    )
  }
}
