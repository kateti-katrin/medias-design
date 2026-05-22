import React, { PureComponent } from 'react'

import A_Text from './A_Text.jsx'

/**
 * Шапка экрана: акцентный заголовок слева + иконка профиля справа.
 * При клике на иконку — handleProfileClick.
 */
export default class O_PageHeader extends PureComponent {
  render() {
    const {
      headingText,
      overlineText,
      handleProfileClick,
      profileInitials,
      hideProfile
    } = this.props

    return (
      <header className="O_PageHeader">
        <div className="O_PageHeader__text">
          {overlineText && <A_Text type="overline" text={overlineText} />}
          <A_Text type="display-heading-1" text={headingText} />
        </div>

        {!hideProfile && (
          <button
            type="button"
            className="O_PageHeader__profile"
            onClick={handleProfileClick}
            aria-label="Открыть профиль"
          >
            {profileInitials ? (
              <span className="O_PageHeader__avatar">{profileInitials}</span>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
              </svg>
            )}
          </button>
        )}
      </header>
    )
  }
}
