import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import O_PageHeader from '../components/O_PageHeader.jsx'

/* Совет дня — выбирается по дню месяца, чтобы не повторяться часто */
const TIPS = [
  {
    overline: '[ совет на сегодня ]',
    title: 'Не показывай дизайнеру референсы без объяснений',
    body: '«Мне нравится вот это» — уже данные. Но объясни, что именно: атмосфера, типографика, чистота, цвет. Иначе дизайнер просто перерисует чужой сайт.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Сначала задача — потом форма',
    body: 'Прежде чем обсуждать цвет и шрифт, договорись зачем нужен этот макет и какое действие должен сделать пользователь. Без задачи дизайн оценить нельзя.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Один экран = одно действие',
    body: 'Если на странице десять CTA — это не «больше вариантов», это шум. Спроси у дизайнера: какое одно действие самое важное? И сделай его в три раза заметнее остальных.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Срочность стоит денег',
    body: 'Дизайн «к понедельнику» — это +20-40% к смете. Не потому что дизайнер жадный, а потому что он отменяет другую работу. Если можешь подождать неделю — подожди.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Прежде чем сказать «не нравится» — спроси «почему»',
    body: 'Почему дизайнер сделал именно так? Возможно, это решение продиктовано задачей, которую ты сам поставил. «Не нравится» — это эмоция. Хочется услышать конкретику.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Брендбук — не обязателен в первой версии',
    body: 'Если у тебя нет фирстиля — не пытайся сделать его до лендинга. Сделай макет, найди тон голоса, и из этого вырастет стиль. Брендбук в начале — это карты для несуществующей страны.'
  },
  {
    overline: '[ совет на сегодня ]',
    title: 'Слово «современно» ничего не значит',
    body: 'Скажи: чистый, минималистичный, плотный, академичный, дерзкий. Это конкретные направления. «Современно» — это просто «как другие». Чьи именно? Покажи примеры.'
  }
]

const QUICK_ACTIONS = [
  {
    key: 'references',
    emoji: '📸',
    title: 'Сохранить референс',
    sub: 'Увидел крутой дизайн — забери в коллекцию'
  },
  {
    key: 'checklist',
    emoji: '✅',
    title: 'Оценить макет',
    sub: '10 вопросов, чтобы понять, годится ли'
  },
  {
    key: 'glossary',
    emoji: '📖',
    title: 'Глянуть в словарь',
    sub: 'Что значит «лидинг», «грид», «дескриптор»'
  }
]

export default class T_Today extends PureComponent {
  constructor(props) {
    super(props)
    const day = new Date().getDate()
    this.state = { tipIndex: day % TIPS.length }
  }

  nextTip = () => {
    this.setState({ tipIndex: (this.state.tipIndex + 1) % TIPS.length })
  }

  render() {
    const { handleProfileClick, handleQuickAction, user } = this.props
    const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : null
    const tip = TIPS[this.state.tipIndex]

    const today = new Date()
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
    const todayLabel = formatter.format(today)

    return (
      <div className="T_Today">
        <O_PageHeader
          overlineText={todayLabel}
          headingText="Сегодня"
          profileInitials={initials}
          handleProfileClick={handleProfileClick}
        />

        <div className="T_Today__body">

          {/* Совет дня — с overline-тегом в скобках, это уместно */}
          <section className="T_Today__tip">
            <A_Text type="overline" text={tip.overline} />
            <A_Text type="display-heading-2" text={tip.title} />
            <A_Text type="body" text={tip.body} />
            <button type="button" className="T_Today__next" onClick={this.nextTip}>
              следующий совет →
            </button>
          </section>

          {/* Что сделать сейчас — обычный заголовок (без скобок), карточки горизонтально */}
          <section className="T_Today__quick">
            <h3 className="T_Today__section-title">Что сделать сейчас</h3>

            <div className="T_Today__cards" role="list">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  className="T_Today__card"
                  onClick={() => handleQuickAction && handleQuickAction(a.key)}
                  role="listitem"
                >
                  <span className="T_Today__card-emoji">{a.emoji}</span>
                  <span className="T_Today__card-title">{a.title}</span>
                  <span className="T_Today__card-sub">{a.sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Полная версия — тоже обычный заголовок */}
          <section className="T_Today__media">
            <h3 className="T_Today__section-title">Читать полную версию</h3>
            <a className="T_Today__media-link" href="https://kateti-katrin.github.io/medias-design/" target="_blank" rel="noopener noreferrer">
              <span>СМЫСЛ — медиа о&nbsp;дизайне</span>
              <span aria-hidden="true">↗</span>
            </a>
          </section>

        </div>
      </div>
    )
  }
}
