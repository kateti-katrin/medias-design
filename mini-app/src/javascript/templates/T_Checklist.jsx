import React, { PureComponent } from 'react'

import A_Text from '../components/A_Text.jsx'
import O_PageHeader from '../components/O_PageHeader.jsx'

const QUESTIONS = [
  { id: 1,  block: 'СУТЬ',         text: 'Сразу понятно, о&nbsp;чём этот макет' },
  { id: 2,  block: 'СУТЬ',         text: 'Главное действие пользователя очевидно' },
  { id: 3,  block: 'СУТЬ',         text: 'Заголовок отвечает на&nbsp;вопрос «зачем мне это»' },
  { id: 4,  block: 'ИЕРАРХИЯ',     text: 'Видно, что важнее, а&nbsp;что второстепенно' },
  { id: 5,  block: 'ИЕРАРХИЯ',     text: 'Глаз двигается по&nbsp;странице, не&nbsp;теряется' },
  { id: 6,  block: 'ЧИТАЕМОСТЬ',   text: 'Текст контрастный, легко читается' },
  { id: 7,  block: 'ЧИТАЕМОСТЬ',   text: 'Шрифты не&nbsp;«дерутся» друг с&nbsp;другом' },
  { id: 8,  block: 'СТИЛЬ',        text: 'Дизайн подходит под аудиторию' },
  { id: 9,  block: 'СТИЛЬ',        text: 'Не&nbsp;выглядит как «много элементов из&nbsp;разных мест»' },
  { id: 10, block: 'МОБИЛЬНАЯ',    text: 'На&nbsp;телефоне всё читается и&nbsp;попадает пальцем' }
]

const OPTIONS = [
  { value: 'ok',   label: 'Да, это&nbsp;ОК',         score:  1 },
  { value: 'meh',  label: 'Не&nbsp;понял / не&nbsp;уверен', score:  0 },
  { value: 'no',   label: 'Нет, плохо',              score: -1 }
]

export default class T_Checklist extends PureComponent {
  state = { answers: {}, current: 0, showResult: false }

  handleAnswer = (value) => {
    const q = QUESTIONS[this.state.current]
    const answers = { ...this.state.answers, [q.id]: value }
    const nextIndex = this.state.current + 1

    if (nextIndex >= QUESTIONS.length) {
      this.setState({ answers, showResult: true })
    } else {
      this.setState({ answers, current: nextIndex })
    }
  }

  handleBack = () => {
    if (this.state.current > 0) {
      this.setState({ current: this.state.current - 1 })
    }
  }

  handleReset = () => {
    this.setState({ answers: {}, current: 0, showResult: false })
  }

  computeScore = () => {
    let total = 0
    QUESTIONS.forEach((q) => {
      const a = this.state.answers[q.id]
      if (a) total += OPTIONS.find((o) => o.value === a).score
    })
    return { total, max: QUESTIONS.length }
  }

  verdict = () => {
    const { total } = this.computeScore()
    if (total >= 7) {
      return { title: 'Можно запускать', body: 'Дизайн делает то, что должен. Доводи мелочи и&nbsp;в&nbsp;продакшен.' }
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
    const { current, showResult } = this.state
    const total = QUESTIONS.length

    if (showResult) {
      const v = this.verdict()
      const { total: score, max } = this.computeScore()
      return (
        <div className="T_Checklist">
          <O_PageHeader
            overlineText="вердикт"
            headingText="Чек-лист"
            profileInitials={initials}
            handleProfileClick={handleProfileClick}
          />

          <div className="T_Checklist__body">
            <div className="T_Checklist__result">
              <A_Text type="overline" text={`[ ${score} из ${max} ]`} />
              <A_Text type="display-heading-2" text={v.title} />
              <A_Text type="body" html={v.body} />
            </div>
            <button type="button" className="T_Checklist__cta" onClick={this.handleReset}>
              пройти заново
            </button>
          </div>
        </div>
      )
    }

    const q = QUESTIONS[current]
    const progress = ((current) / total) * 100

    return (
      <div className="T_Checklist">
        <O_PageHeader
          overlineText="оценить макет за 2 минуты"
          headingText="Чек-лист"
          profileInitials={initials}
          handleProfileClick={handleProfileClick}
        />

        <div className="T_Checklist__body">

          {/* Прогресс */}
          <div className="T_Checklist__progress">
            <div className="T_Checklist__progress-meta">
              <span className="T_Checklist__progress-step">{current + 1} / {total}</span>
              <button
                type="button"
                className="T_Checklist__back"
                onClick={this.handleBack}
                disabled={current === 0}
              >← назад</button>
            </div>
            <div className="T_Checklist__bar">
              <div className="T_Checklist__bar-fill" style={{ width: progress + '%' }} />
            </div>
          </div>

          {/* Вопрос */}
          <div className="T_Checklist__question">
            <span className="T_Checklist__block">{q.block}</span>
            <h2 className="T_Checklist__text" dangerouslySetInnerHTML={{ __html: q.text }} />
          </div>

          {/* Варианты — вертикально, крупные */}
          <div className="T_Checklist__options">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="T_Checklist__opt"
                onClick={() => this.handleAnswer(opt.value)}
              >
                <span dangerouslySetInnerHTML={{ __html: opt.label }} />
              </button>
            ))}
          </div>

        </div>
      </div>
    )
  }
}
