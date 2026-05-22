import React, { PureComponent } from 'react'

import O_PageHeader from '../components/O_PageHeader.jsx'

const TERMS = [
  { term: 'Лидинг',       en: 'leading',          def: 'Межстрочный интервал. Если буквы «слипаются» по вертикали — увеличь лидинг.' },
  { term: 'Кёрнинг',      en: 'kerning',          def: 'Расстояние между конкретными парами букв. Заметно в заголовках: «АV», «То».' },
  { term: 'Грид',         en: 'grid',             def: 'Невидимая сетка, по которой выстраивается макет. Колонки, отступы, ритм.' },
  { term: 'Дескриптор',   en: 'descriptor',       def: 'Короткая фраза-подзаголовок к названию бренда. Объясняет, что вы делаете.' },
  { term: 'CTA',          en: 'call to action',   def: 'Главное действие на странице: «Купить», «Оставить заявку». Один экран — один CTA.' },
  { term: 'Hero',         en: 'hero',             def: 'Первый экран сайта, до прокрутки. Здесь — заголовок и CTA.' },
  { term: 'UI / UX',      en: 'ui / ux',          def: 'UI — то, что видно (формы, кнопки). UX — то, как ощущается (легко ли понять, что делать).' },
  { term: 'Wireframe',    en: 'wireframe',        def: 'Чёрно-белый каркас будущего макета. Без цвета и фото — только структура.' },
  { term: 'Mockup',       en: 'mockup',           def: 'Полноценный макет в цвете, ещё не функциональный. То, что показывают клиенту.' },
  { term: 'Prototype',    en: 'prototype',        def: 'Интерактивный макет: можно тыкать, переходить, проверять сценарий.' },
  { term: 'Тон голоса',   en: 'tone of voice',    def: 'Как бренд разговаривает. Серьёзно или с юмором, на «вы» или на «ты», коротко или развёрнуто.' },
  { term: 'Серая зона',   en: '—',                def: 'Когда дизайнер делает что-то «по правилам», но без души. Технически — норм, по смыслу — пусто.' },
  { term: 'Брендбук',     en: 'brand book',       def: 'Документ с правилами фирстиля: цвета, шрифты, логотип, тон голоса.' },
  { term: 'Гайдлайн',     en: 'guideline',        def: 'Часть брендбука — конкретные правила использования. Где логотип ставить, как нет.' },
  { term: 'Палитра',      en: 'palette',          def: 'Набор цветов бренда. Обычно: 1 основной + 1 акцент + 2-3 нейтральных.' },
  { term: 'Айдентика',    en: 'identity',         def: 'Визуальная и смысловая система бренда — то, по чему вас узнают.' },
  { term: 'Рендер',       en: 'render',           def: 'Готовая «отрисованная» картинка. Иногда так называют финальную презентацию макета.' },
  { term: 'Адаптив',      en: 'adaptive',         def: 'Версия макета под разные экраны: десктоп, планшет, мобильный.' },
  { term: 'Овертайп',     en: 'overtype',         def: 'Когда текст накладывают на изображение. Требует фона-плашки или плотных шрифтов.' },
  { term: 'Спред',        en: 'spread',           def: 'Разворот в журнале или презентации — две страницы вместе.' }
]

export default class T_Glossary extends PureComponent {
  state = { query: '', openId: null }

  render() {
    const { handleProfileClick, user } = this.props
    const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : null
    const { query, openId } = this.state

    const q = query.trim().toLowerCase()
    const filtered = q
      ? TERMS.filter((t) =>
          t.term.toLowerCase().includes(q) ||
          t.en.toLowerCase().includes(q) ||
          t.def.toLowerCase().includes(q)
        )
      : TERMS

    return (
      <div className="T_Glossary">
        <O_PageHeader
          overlineText="[ что значит это слово ]"
          headingText="Словарь"
          profileInitials={initials}
          handleProfileClick={handleProfileClick}
        />

        <div className="T_Glossary__body">

          <div className="T_Glossary__search">
            <input
              type="search"
              value={query}
              onChange={(e) => this.setState({ query: e.target.value })}
              placeholder="искать термин"
              autoFocus={false}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="T_Glossary__empty">Ничего не нашли. Скажи дизайнеру в&nbsp;чате, что в&nbsp;следующий раз пусть переведёт.</p>
          ) : (
            <ul className="T_Glossary__list">
              {filtered.map((t, i) => (
                <li
                  key={i}
                  className={'T_Glossary__item' + (openId === i ? ' is-open' : '')}
                  onClick={() => this.setState({ openId: openId === i ? null : i })}
                >
                  <div className="T_Glossary__head">
                    <span className="T_Glossary__term">{t.term}</span>
                    {t.en !== '—' && <span className="T_Glossary__en">{t.en}</span>}
                  </div>
                  {openId === i && (
                    <p className="T_Glossary__def">{t.def}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    )
  }
}
