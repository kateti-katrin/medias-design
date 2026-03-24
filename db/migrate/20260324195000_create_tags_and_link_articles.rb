class CreateTagsAndLinkArticles < ActiveRecord::Migration[8.1]
  class MigrationTag < ApplicationRecord
    self.table_name = "tags"
  end

  class MigrationArticle < ApplicationRecord
    self.table_name = "articles"
  end

  def up
    create_table :tags do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.timestamps
    end unless table_exists?(:tags)

    add_index :tags, :name, unique: true unless index_exists?(:tags, :name)
    add_index :tags, :slug, unique: true unless index_exists?(:tags, :slug)

    add_reference :articles, :tag, foreign_key: true unless column_exists?(:articles, :tag_id)

    MigrationTag.reset_column_information
    MigrationArticle.reset_column_information

    MigrationArticle.find_each do |article|
      name = article.tag.to_s.strip.downcase
      name = "без тега" if name.blank?

      tag = MigrationTag.find_or_initialize_by(name: name)
      if tag.new_record?
        base_slug = I18n.transliterate(name, locale: :ru).parameterize.presence || "tag"
        candidate = base_slug
        suffix = 2

        while MigrationTag.exists?(slug: candidate)
          candidate = "#{base_slug}-#{suffix}"
          suffix += 1
        end

        tag.slug = candidate
        tag.save!
      end

      article.update_columns(tag_id: tag.id, tag: tag.name)
    end

    change_column_null :articles, :tag_id, false
  end

  def down
    change_column_null :articles, :tag_id, true if column_exists?(:articles, :tag_id)
    remove_reference :articles, :tag, foreign_key: true if column_exists?(:articles, :tag_id)

    remove_index :tags, :slug if index_exists?(:tags, :slug)
    remove_index :tags, :name if index_exists?(:tags, :name)
    drop_table :tags if table_exists?(:tags)
  end
end
