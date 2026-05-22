# Rake-задачи для запуска фоновой работы вручную.
# Запуск: bin/rails background:generate_share_images
#
# Структура копирует подход преподавателя ZakharDay/ADC2025-Rails-Playground-07

namespace :background do
  desc "Сгенерировать share-картинки для всех статей (через Solid Queue)"
  task generate_share_images: :environment do
    count = 0
    Article.find_each do |article|
      GenerateShareImageJob.perform_later(article)
      count += 1
    end
    puts "Поставлено в очередь: #{count} статей. Запусти worker: bin/jobs"
  end

  desc "Очистить кеш счётчиков просмотров"
  task reset_views: :environment do
    Article.update_all(views_count: 0)
    puts "Просмотры сброшены у всех статей."
  end
end
