import classnames from 'classnames'
import React, { PureComponent } from 'react'

/* SVG-иконки без подписей — главная / референсы / чек-лист / словарь */
const ICONS = {
  today: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H10v7H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  references: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="0" />
      <circle cx="9" cy="11" r="1.6" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  ),
  checklist: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7l2 2 4-4" />
      <path d="M5 14l2 2 4-4" />
      <line x1="13" y1="7" x2="20" y2="7" />
      <line x1="13" y1="16" x2="20" y2="16" />
    </svg>
  ),
  glossary: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" />
      <line x1="8" y1="9" x2="15" y2="9" />
      <line x1="8" y1="13" x2="15" y2="13" />
    </svg>
  )
}

const ITEMS = [
  { key: 'today',      label: 'Сегодня',     icon: ICONS.today },
  { key: 'references', label: 'Референсы',   icon: ICONS.references },
  { key: 'checklist',  label: 'Чек-лист',    icon: ICONS.checklist },
  { key: 'glossary',   label: 'Словарь',     icon: ICONS.glossary }
]

export default class O_Navigation extends PureComponent {
  render() {
    const { current, handleNavigate } = this.props

    return (
      <nav className="O_Navigation" aria-label="Основное меню">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={classnames('O_Navigation__item', {
              active: current === item.key
            })}
            onClick={() => handleNavigate && handleNavigate(item.key)}
            aria-label={item.label}
            aria-current={current === item.key ? 'page' : undefined}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    )
  }
}
