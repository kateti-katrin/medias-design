class QuoteCalculator
  PROJECT_TYPES = %w[landing corporate shop presentation].freeze
  URGENCIES = %w[normal fast rush].freeze
  TIERS = %w[freelancer agency].freeze

  Result = Struct.new(:tier, :label, :min, :max, :weeks, :additions, keyword_init: true)

  class << self
    def call(params)
      data = normalize(params)
      freelancer = compute(data, "freelancer")
      agency = compute(data, "agency")

      {
        project_type: data[:type],
        pages: data[:pages],
        freelancer: freelancer.to_h,
        agency: agency.to_h,
        text: render_text(data, freelancer, agency)
      }
    end

    private

    def config
      @config ||= Rails.application.config_for(:pricing).deep_stringify_keys
    end

    def normalize(params)
      raw_type = params[:type].to_s
      type = PROJECT_TYPES.include?(raw_type) ? raw_type : "landing"

      raw_urgency = params[:urgency].to_s
      urgency = URGENCIES.include?(raw_urgency) ? raw_urgency : "normal"

      pages = params[:pages].to_i
      max_pages = config.dig("pages", "max_pages").to_i
      pages = pages.clamp(1, max_pages.positive? ? max_pages : 30)

      {
        type: type,
        urgency: urgency,
        pages: pages,
        brandbook: truthy?(params[:brandbook]),
        copywriting: truthy?(params[:copywriting]),
        analytics: truthy?(params[:analytics])
      }
    end

    def truthy?(value)
      ["1", "true", true, "on", "yes"].include?(value)
    end

    def compute(data, tier)
      project = config.dig("base", tier, data[:type])
      raise ArgumentError, "Unknown project/tier" unless project

      min = project["min"].to_f
      max = project["max"].to_f
      weeks = project["weeks"].to_i

      pages_factor = 1 + (data[:pages] - 1) * config.dig("pages", "factor_per_extra_page").to_f
      min *= pages_factor
      max *= pages_factor

      additions = []

      %w[brandbook copywriting analytics].each do |addon|
        next unless data[addon.to_sym]

        addon_data = config.dig("addons", addon, tier)
        next unless addon_data

        min += addon_data["min"].to_f
        max += addon_data["max"].to_f
        weeks += addon_data["weeks"].to_i
        additions << "#{addon_label(addon)}: +#{money(addon_data['min'])} — #{money(addon_data['max'])}"
      end

      if data[:urgency] != "normal"
        urgency_data = config.dig("urgency", data[:urgency])
        if urgency_data
          min *= urgency_data["multiplier"].to_f
          max *= urgency_data["multiplier"].to_f
          weeks = [weeks + urgency_data["weeks_delta"].to_i, 1].max
          additions << urgency_label(data[:urgency], urgency_data["multiplier"])
        end
      end

      Result.new(
        tier: tier,
        label: project["label"],
        min: min.round,
        max: max.round,
        weeks: weeks,
        additions: additions
      )
    end

    def addon_label(addon)
      { "brandbook" => "Фирменный стиль", "copywriting" => "Тексты", "analytics" => "Аналитика" }.fetch(addon)
    end

    def urgency_label(urgency, multiplier)
      percent = ((multiplier.to_f - 1) * 100).round
      urgency == "rush" ? "Очень срочно: +#{percent}%" : "Срочность: +#{percent}%"
    end

    def money(amount)
      "#{amount.to_i.to_s.reverse.scan(/\d{1,3}/).join(' ').reverse} ₽"
    end

    def adds_list(items)
      return "  · Без дополнительных опций" if items.empty?

      items.map { |a| "  · #{a}" }.join("\n")
    end

    def render_text(data, freelancer, agency)
      <<~TEXT
        ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ БЮДЖЕТА

        Проект: #{freelancer.label}, #{data[:pages]} экр./стр.

        ── Фрилансер ──────────────────────
        Бюджет: #{money(freelancer.min)} — #{money(freelancer.max)}
        Срок:   ~#{freelancer.weeks} нед.
        Что учтено:
        #{adds_list(freelancer.additions)}

        ── Агентство ──────────────────────
        Бюджет: #{money(agency.min)} — #{money(agency.max)}
        Срок:   ~#{agency.weeks} нед.
        Что учтено:
        #{adds_list(agency.additions)}

        Это ориентир. Финальная смета — после брифа и согласования состава работ.
      TEXT
    end
  end
end
