import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import O_PageHeader from '../components/O_PageHeader.jsx'

const QUESTIONS = [
  { id: 1,  block: 'СУТЬ',         text: 'Сразу понятно, о чём этот макет' },
  { id: 2,  block: 'СУТЬ',         text: 'Главное действие пользователя очевидно' },
  { id: 3,  block: 'СУТЬ',         text: 'Заголовок отвечает на вопрос «зачем мне это»' },
  { id: 4,  block: 'ИЕРАРХИЯ',     text: 'Видно что важнее, что второстепенно' },
  { id: 5,  block: 'ИЕРАРХИЯ',     text: 'Глаз двигается по странице, не теряется' },
  { id: 6,  block: 'ЧИТАЕМОСТЬ',   text: 'Текст контрастный, легко читается' },
  { id: 7,  block: 'ЧИТАЕМОСТЬ',   text: 'Шрифты не «дерутся» друг с другом' },
  { id: 8,  block: 'СТИЛЬ',        text: 'Дизайн подходит под аудиторию' },
  { id: 9,  block: 'СТИЛЬ',        text: 'Не выглядит как «много элементов из разных мест»' },
  { id: 10, block: 'МОБИЛЬНАЯ',    text: 'На телефоне всё читается и попадает пальцем' }
]

const OPTIONS = [
  { value: 'ok',   label: 'ОК',     emoji: '✓', score: 1 },
  { value: 'meh',  label: 'НЕ ПОНЯТНО', emoji: '?', score: 0 },
  { value: 'no',   label: 'НЕТ',    emoji: '×', score: -1 }
]

export default class T_Checklist extends PureComponent {
  state = { answers: {}, showResult: false }

  handleAnswer = (qid, value) => {
    const answers = { ...this.state.answers, [qid]: value }
    this.setState({ answers })
  }

  handleReset = () => {
    this.setState({ answers: {}, showResult: false })
  }

  computeScore = () => {
    let total = 0
    let answered = 0
    QUESTIONS.forEach((q) => {
      const a = this.state.answers[q.id]
      if (a) {
        answered += 1
        total += OPTIONS.find((o) => o.value === a).score
      }
    })
    return { total, answered, max: QUESTIONS.length }
  }

  verdict = () => {
    const { total, answered, max } = this.computeScore()
    if (answered < max) {
      return { title: 'Ответь на все вопросы', body: 'Чтобы получить вердикт — пройди по всему списку.' }
    }
    if (total >= 7) {
      return { title: 'Можно запускать', body: 'Дизайн делает то, что должен. Доводи мелочи и в&nbsp;продакшен.' }
    }
    if (total >= 3) {
      return { title: 'Слабые места есть', body: 'Сходи к&nbsp;дизайнеру с&nbsp;конкретными «нет» — пусть переделает только их, остальное хорошо.' }
    }
    if (total >= 0) {
      return { title: 'Нужен ещё круг', body: 'Слишком много непонятного. Возможно вы&nbsp;разошлись в&nbsp;задаче. Лучше переговорить, а&nbsp;не&nbsp;править макет.' }
    }
    return { title: 'Не годится', body: 'Это не&nbsp;вопрос правок — это вопрос постановки задачи. Откати назад к&nbsp;брифу.' }
  }

  render() {
    const { handleProfileClick, user } = this.props
    const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : null
    const { answers, showResult } = this.state
    const { answered, max, total } = this.computeScore()

    return (
      <div className="T_Checklist">
        <O_PageHeader
          overlineText="[ оценить макет за 2 минуты ]"
          headingText="Чек-лист"
          profileInitials={initials}
          handleProfileClick={handleProfileClick}
        />

        <div className="T_Checklist__body">

          <div className="T_Checklist__progress">
            <A_Text type="muted" text={`Отвечено ${answered} из ${max}`} />
            <div className="T_Checklist__bar">
              <div
                className="T_Checklist__bar-fill"
                style={{ width: (answered / max) * 100 + '%' }}
              />
            </div>
          </div>

          <ol className="T_Checklist__list">
            {QUESTIONS.map((q, i) => (
              <li key={q.id} className="T_Checklist__item">
                <div className="T_Checklist__num">{String(i + 1).padStart(2, '0')}</div>
                <div className="T_Checklist__q">
                  <span className="T_Checklist__block">{q.block}</span>
                  <span className="T_Checklist__text">{q.text}</span>
                  <div className="T_Checklist__options">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={'T_Checklist__opt' + (answers[q.id] === opt.value ? ' is-picked' : '')}
                        onClick={() => this.handleAnswer(q.id, opt.value)}
                      >
                        <span className="T_Checklist__opt-emoji">{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="T_Checklist__cta"
            onClick={() => this.setState({ showResult: true })}
            disabled={answered < max}
          >
            {answered < max ? `ещё ${max - answered}` : 'вердикт →'}
          </button>

          {showResult && answered === max && (
            <div className="T_Checklist__result">
              <A_Text type="overline" text={`[ ${total} из ${max} ]`} />
              <A_Text type="display-heading-2" text={this.verdict().title} />
              <A_Text type="body" html={this.verdict().body} />
              <button type="button" className="T_Checklist__reset" onClick={this.handleReset}>
                пройти заново
              </button>
            </div>
          )}

        </div>
      </div>
    )
  }
}
