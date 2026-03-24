class ArticleCoverUploader < CarrierWave::Uploader::Base
  storage :file

  # Оптимизация через vips: autorotate + сжатие до качества 82
  process :vips_optimize

  def store_dir
    "uploads/articles/#{model.id}"
  end

  def extension_allowlist
    %w[jpg jpeg png webp]
  end

  def default_url(*)
    ActionController::Base.helpers.asset_path("article-large.png")
  end

  private

  # Заменяет carrierwave-imageoptimizer: autorotate + strip metadata + lossy compress
  def vips_optimize
    return unless defined?(Vips)
    return unless file&.path && File.exist?(file.path)

    ext = File.extname(file.path).downcase
    return unless %w[.jpg .jpeg .png .webp].include?(ext)

    image = Vips::Image.new_from_file(file.path, access: :sequential, autorotate: true)

    case ext
    when ".jpg", ".jpeg"
      image.write_to_file(file.path, Q: 82, strip: true, optimize_coding: true)
    when ".png"
      image.write_to_file(file.path, compression: 7, strip: true)
    when ".webp"
      image.write_to_file(file.path, Q: 82, strip: true)
    end
  rescue StandardError
    nil
  end
end
