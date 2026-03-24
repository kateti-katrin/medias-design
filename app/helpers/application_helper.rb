module ApplicationHelper
  DEFAULT_META_TITLE = "СМЫСЛ — медиа о дизайне".freeze
  DEFAULT_META_DESCRIPTION = "Медиа о продающем дизайне для тех, кто заказывает сайты и работает с подрядчиками.".freeze
  DEFAULT_OG_TYPE = "website".freeze
  DEFAULT_OG_IMAGE = "hero-bg.png".freeze

  def set_meta_tags(title: nil, description: nil, og: {}, canonical: nil)
    content_for(:title, title) if title.present?
    content_for(:meta_description, description) if description.present?
    content_for(:meta_canonical_url, canonical) if canonical.present?

    content_for(:meta_og_title, og[:title]) if og[:title].present?
    content_for(:meta_og_description, og[:description]) if og[:description].present?
    content_for(:meta_og_type, og[:type]) if og[:type].present?
    content_for(:meta_og_url, og[:url]) if og[:url].present?
    content_for(:meta_og_image, meta_image_url(og[:image])) if og[:image].present?
  end

  def meta_title
    content_for(:title).presence || DEFAULT_META_TITLE
  end

  def meta_description
    content_for(:meta_description).presence || DEFAULT_META_DESCRIPTION
  end

  def meta_canonical_url
    content_for(:meta_canonical_url).presence || request.original_url
  end

  def meta_og_title
    content_for(:meta_og_title).presence || meta_title
  end

  def meta_og_description
    content_for(:meta_og_description).presence || meta_description
  end

  def meta_og_type
    content_for(:meta_og_type).presence || DEFAULT_OG_TYPE
  end

  def meta_og_url
    content_for(:meta_og_url).presence || meta_canonical_url
  end

  def meta_og_image
    content_for(:meta_og_image).presence || meta_image_url(DEFAULT_OG_IMAGE)
  end

  private

  def meta_image_url(source)
    value = source.to_s
    return value if value.start_with?("http://", "https://")

    path = value.start_with?("/") ? value : image_path(value)
    base = AppSettings.app_host.presence || request.base_url
    URI.join(base, path).to_s
  end
end
