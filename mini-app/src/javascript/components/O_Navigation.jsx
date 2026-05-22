import classnames from 'classnames'
import React, { PureComponent } from 'react'

const ITEMS = [
  { key: 'articles', label: 'Статьи' },
  { key: 'brief', label: 'ТЗ' },
  { key: 'profile', label: 'Профиль' }
]

export default class O_Navigation extends PureComponent {
  render() {
    const { current, handleNavigate } = this.props

    return (
      <nav className="O_Navigation">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className={classnames('O_Navigation__item', {
              active: current === item.key
            })}
            onClick={() => handleNavigate && handleNavigate(item.key)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    )
  }
}
