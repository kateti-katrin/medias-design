import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import O_PageHeader from '../components/O_PageHeader.jsx'

const STORAGE_KEY = 'smysl_references'

const DEMO = [
  { id: 1, color: '#e8d6b3', tag: 'типографика',  note: 'Японский плакат, баланс плотности' },
  { id: 2, color: '#7a8470', tag: 'лендинг',      note: 'Чистый hero, один CTA, плюс fixed nav' },
  { id: 3, color: '#c9b8a8', tag: 'упаковка',     note: 'Кофе из Тбилиси, понравилась палитра' },
  { id: 4, color: '#3d5a6c', tag: 'презентация',  note: 'Структура титров и нумерации' }
]

const TAGS = ['все', 'лендинг', 'упаковка', 'типографика', 'презентация', 'логотип', 'иллюстрация']

export default class T_References extends PureComponent {
  constructor(props) {
    super(props)

    let saved = []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) saved = JSON.parse(raw)
    } catch (e) {}

    this.state = {
      items: saved.length ? saved : DEMO,
      filter: 'все',
      adding: false,
      newNote: '',
      newTag: 'лендинг'
    }
    this.fileInput = React.createRef()
  }

  persist = (items) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch (e) {}
  }

  handlePickFile = () => {
    if (this.fileInput.current) this.fileInput.current.click()
  }

  handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newItem = {
        id: Date.now(),
        photo: ev.target.result,
        tag: this.state.newTag,
        note: this.state.newNote || 'Новый референс'
      }
      const items = [newItem, ...this.state.items]
      this.persist(items)
      this.setState({
        items,
        adding: false,
        newNote: '',
        newTag: 'лендинг'
      })
    }
    reader.readAsDataURL(file)
  }

  handleDelete = (id) => {
    const items = this.state.items.filter((i) => i.id !== id)
    this.persist(items)
    this.setState({ items })
  }

  render() {
    const { handleProfileClick, user } = this.props
    const { items, filter, adding, newNote, newTag } = this.state
    const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : null
    const visible = filter === 'все' ? items : items.filter((i) => i.tag === filter)

    return (
      <div className="T_References">
        <O_PageHeader
          overlineText="[ полевая коллекция ]"
          headingText="Референсы"
          profileInitials={initials}
          handleProfileClick={handleProfileClick}
        />

        <div className="T_References__body">

          <div className="T_References__filters">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={'T_References__filter' + (filter === tag ? ' is-active' : '')}
                onClick={() => this.setState({ filter: tag })}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="T_References__add"
            onClick={() => this.setState({ adding: !adding })}
          >
            <span>+ добавить</span>
            <span style={{ opacity: 0.65, fontSize: 12 }}>фото с&nbsp;камеры или галереи</span>
          </button>

          {adding && (
            <div className="T_References__form">
              <label>
                <A_Text type="overline" text="тег" />
                <select
                  value={newTag}
                  onChange={(e) => this.setState({ newTag: e.target.value })}
                >
                  {TAGS.filter((t) => t !== 'все').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label>
                <A_Text type="overline" text="заметка" />
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => this.setState({ newNote: e.target.value })}
                  placeholder="что именно зацепило"
                  maxLength={80}
                />
              </label>

              <input
                ref={this.fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={this.handleFileChange}
                style={{ display: 'none' }}
              />

              <button type="button" className="T_References__pick" onClick={this.handlePickFile}>
                выбрать фото
              </button>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="T_References__empty">
              <A_Text type="muted" text="Пока ничего. Жми «+ добавить»." />
            </div>
          ) : (
            <div className="T_References__grid">
              {visible.map((item) => (
                <div key={item.id} className="T_References__card">
                  <div
                    className="T_References__cover"
                    style={item.photo
                      ? { backgroundImage: 'url(' + item.photo + ')' }
                      : { backgroundColor: item.color }
                    }
                  >
                    <span className="T_References__tag">{item.tag}</span>
                    <button
                      type="button"
                      className="T_References__delete"
                      onClick={() => this.handleDelete(item.id)}
                      aria-label="Удалить"
                    >×</button>
                  </div>
                  <p className="T_References__note">{item.note}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    )
  }
}
