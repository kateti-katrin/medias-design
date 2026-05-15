class BriefBuilder
  PROJECT_TYPES = [
    "Лендинг для услуги",
    "Многостраничный корпоративный сайт",
    "Интернет-магазин",
    "Презентация/коммерческое предложение"
  ].freeze

  CTAS = [
    "Оставить заявку",
    "Купить / оформить заказ",
    "Подписаться / получить материал",
    "Перейти в мессенджер"
  ].freeze

  BRANDS = [
    "Есть брендбук и готовые материалы",
    "Есть логотип, но нет системы",
    "Нет фирменного стиля"
  ].freeze

  DEADLINES = [
    "В течение месяца",
    "1–2 месяца",
    "Более 2 месяцев"
  ].freeze

  MAX_TEXT = 2000

  def self.call(params)
    data = normalize(params)
    { text: render(data), normalized: data }
  end

  def self.normalize(params)
    {
      projectType: clamp(allowed(params[:projectType], PROJECT_TYPES) || PROJECT_TYPES.first, 200),
      goal: clamp(params[:goal].to_s.strip, MAX_TEXT),
      audience: clamp(params[:audience].to_s.strip, MAX_TEXT),
      cta: clamp(allowed(params[:cta], CTAS) || CTAS.first, 200),
      brand: clamp(allowed(params[:brand], BRANDS) || BRANDS.last, 200),
      blocks: clamp(params[:blocks].to_s.strip, MAX_TEXT),
      deadline: clamp(allowed(params[:deadline], DEADLINES) || DEADLINES.first, 200),
      notes: clamp(params[:notes].to_s.strip, MAX_TEXT)
    }
  end

  def self.allowed(value, list)
    value = value.to_s
    list.include?(value) ? value : nil
  end

  def self.clamp(str, len)
    str.to_s[0, len].to_s
  end
  private_class_method :clamp, :allowed, :normalize

  def self.render(data)
    brand_note =
      case data[:brand]
      when "Есть брендбук и готовые материалы"
        "Фирменный стиль готов — брендбук и материалы предоставим."
      when "Есть логотип, но нет системы"
        "Есть логотип, но единого стиля нет. Нужно выстроить систему."
      else
        "Фирменного стиля нет. Потребуется разработка с нуля."
      end

    notes_line = data[:notes].present? ? "\n\nДополнительно\n#{data[:notes]}" : ""

    <<~TEXT.strip
      ТЕХНИЧЕСКОЕ ЗАДАНИЕ НА ДИЗАЙН

      Проект: #{data[:projectType]}
      Срок запуска: #{data[:deadline]}

      Задача
      #{data[:goal]}

      Целевая аудитория
      #{data[:audience]}

      Ключевое действие пользователя
      #{data[:cta]}

      Фирменный стиль
      #{brand_note}

      Состав страницы / экранов
      #{data[:blocks]}#{notes_line}

      Ожидаемый результат: готовые макеты для передачи в разработку, соответствующие цели проекта и аудитории.
    TEXT
  end
end
