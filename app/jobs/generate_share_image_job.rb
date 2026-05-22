# Активная джоба для генерации share-картинки статьи (для соцсетей).
# Запускается через Solid Queue. Пока — заглушка, реальная генерация
# через MiniMagick / vips добавится позже.
#
# Использование:
#   GenerateShareImageJob.perform_later(article)
#
# Запустить worker:
#   bin/jobs
class GenerateShareImageJob < ApplicationJob
  queue_as :default

  def perform(article)
    return unless article

    Rails.logger.info "[GenerateShareImageJob] Article ##{article.id} «#{article.title}»"

    # TODO: Сгенерировать 1200×630 PNG с заголовком статьи и логотипом.
    # Например через vips:
    #   image = Vips::Image.text(article.title, font: "Bounded 64", width: 1100)
    #   ...
    # Затем сохранить через Active Storage:
    #   article.share_image.attach(io: StringIO.new(image.write_to_buffer(".png")),
    #                              filename: "share-#{article.id}.png",
    #                              content_type: "image/png")
  end
end
