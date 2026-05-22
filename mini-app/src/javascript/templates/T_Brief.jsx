import React, { PureComponent } from 'react'

import O_PageHeader from '../components/O_PageHeader.jsx'
import O_Form from '../components/O_Form.jsx'
import A_Button from '../components/A_Button.jsx'

const FIELDS = [
  {
    label: 'Что за продукт?',
    name: 'brief_product',
    param: 'product',
    type: 'text',
    placeholder: 'Например: сервис аренды самокатов'
  },
  {
    label: 'Кто целевая аудитория?',
    name: 'brief_audience',
    param: 'audience',
    type: 'text',
    placeholder: 'Кто этим будет пользоваться'
  },
  {
    label: 'Какую задачу решает дизайн?',
    name: 'brief_task',
    param: 'task',
    type: 'text',
    multiline: true,
    placeholder: 'Лендинг, ребрендинг, MVP-приложение…'
  },
  {
    label: 'Что должно случиться у пользователя?',
    name: 'brief_outcome',
    param: 'outcome',
    type: 'text',
    multiline: true,
    placeholder: 'Например: оставить заявку, скачать приложение'
  },
  {
    label: 'Срок и бюджет (примерно)',
    name: 'brief_budget',
    param: 'budget',
    type: 'text',
    placeholder: 'Месяц / 200к ₽'
  }
]

const INITIAL = {
  product: '',
  audience: '',
  task: '',
  outcome: '',
  budget: ''
}

export default class T_Brief extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { formData: { ...INITIAL }, result: null }
  }

  handleInput = (param, value) => {
    this.setState({ formData: { ...this.state.formData, [param]: value } })
  }

  handleSubmit = () => {
    const { product, audience, task, outcome, budget } = this.state.formData
    const lines = [
      'ТЗ (черновик, собрано в СМЫСЛе)',
      '',
      `Продукт: ${product || '—'}`,
      `Аудитория: ${audience || '—'}`,
      `Задача: ${task || '—'}`,
      `Ожидаемый результат: ${outcome || '—'}`,
      `Сроки / бюджет: ${budget || '—'}`,
      '',
      'Это рыба. Доработай руками — в смысле, не отправляй студии как есть.'
    ]
    this.setState({ result: lines.join('\n') })
  }

  handleReset = () => {
    this.setState({ formData: { ...INITIAL }, result: null })
  }

  render() {
    const { formData, result } = this.state

    const buttons = [{ type: 'primary', text: 'Собрать ТЗ' }]

    return (
      <div className="T_Brief">
        <O_PageHeader headingText="Собрать ТЗ" />

        <div className="T_Brief__form">
          <O_Form
            fields={FIELDS}
            buttons={buttons}
            formData={formData}
            actions={{
              handleInput: this.handleInput,
              handleFormSubmit: this.handleSubmit
            }}
          />
        </div>

        {result && (
          <>
            <div className="T_Brief__result">{result}</div>
            <div className="T_Brief__form">
              <A_Button
                text="Собрать заново"
                type="tertiary"
                full
                handleClick={this.handleReset}
              />
            </div>
          </>
        )}
      </div>
    )
  }
}
