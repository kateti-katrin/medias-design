# Be sure to restart your server when you modify this file.

Rails.application.config.assets.version = "1.0"

# Add builds/ so Propshaft serves compiled JS/CSS
Rails.application.config.assets.paths << Rails.root.join("app/assets/builds")

# Add fonts directory
Rails.application.config.assets.paths << Rails.root.join("app/assets/fonts")
