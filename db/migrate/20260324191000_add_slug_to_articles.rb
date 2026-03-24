class AddSlugToArticles < ActiveRecord::Migration[8.1]
  class MigrationArticle < ApplicationRecord
    self.table_name = "articles"
  end

  CYRILLIC_TO_LATIN = {
    "а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d", "е" => "e",
    "ё" => "e", "ж" => "zh", "з" => "z", "и" => "i", "й" => "y", "к" => "k",
    "л" => "l", "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
    "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h", "ц" => "ts",
    "ч" => "ch", "ш" => "sh", "щ" => "shch", "ъ" => "", "ы" => "y", "ь" => "",
    "э" => "e", "ю" => "yu", "я" => "ya"
  }.freeze

  def up
    add_column :articles, :slug, :string unless column_exists?(:articles, :slug)

    MigrationArticle.reset_column_information

    MigrationArticle.find_each do |article|
      base_slug = build_slug(article.title)
      candidate = base_slug
      suffix = 2

      while MigrationArticle.where.not(id: article.id).exists?(slug: candidate)
        candidate = "#{base_slug}-#{suffix}"
        suffix += 1
      end

      article.update_columns(slug: candidate)
    end

    add_index :articles, :slug, unique: true unless index_exists?(:articles, :slug)
    change_column_null :articles, :slug, false
  end

  def down
    remove_index :articles, :slug if index_exists?(:articles, :slug)
    remove_column :articles, :slug if column_exists?(:articles, :slug)
  end

  private

  def build_slug(title)
    source = title.to_s.strip
    transliterated = I18n.transliterate(source, locale: :ru)
    transliterated = transliterate_ru(source) if transliterated.match?(/[А-Яа-яЁё]/)

    transliterated.parameterize.presence || "article"
  end

  def transliterate_ru(text)
    text.to_s.each_char.map do |char|
      lower = char.downcase
      mapped = CYRILLIC_TO_LATIN[lower]
      mapped.nil? ? char : mapped
    end.join
  end
end
