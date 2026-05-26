source "https://rubygems.org"

gem "rails", "~> 8.1.2", ">= 8.1.2.1"
gem "propshaft"
gem "sqlite3", ">= 2.1"
gem "puma", ">= 5.0"
gem "jsbundling-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "cssbundling-rails"
gem "jbuilder"
gem "meta-tags"
gem "devise"
gem "devise-i18n"
gem "devise-jwt"
gem "rack-cors"
gem "carrierwave", "~> 3.1"
# carrierwave-imageoptimizer не совместим с carrierwave 3.0 — добавим при апгрейде carrierwave до 2.x или замене
gem "ruby-vips"
gem "image_processing"
gem "marcel"
gem "russian"
gem "will_paginate", "~> 4.0"

# Деплой как Docker-контейнер (Kamal) — как у преподавателя
gem "kamal", require: false

# HTTP/2 + asset caching + X-Sendfile поверх Puma
gem "thruster", require: false

# Pin psych to exactly bundled version (avoids libyaml native build)
gem "psych", "= 5.0.1"

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"
gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri mingw mswin x64_mingw ], require: "debug/prelude"

  # Security & style — как у преподавателя
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
end

group :development do
  gem "web-console"
end

group :test do
  # System tests через браузер
  gem "capybara"
  gem "selenium-webdriver"
end
