class AddPublicUuidToArticles < ActiveRecord::Migration[8.1]
  class MigrationArticle < ApplicationRecord
    self.table_name = "articles"
    self.inheritance_column = :_type_disabled
  end

  def up
    add_column :articles, :public_uuid, :string unless column_exists?(:articles, :public_uuid)

    MigrationArticle.reset_column_information

    MigrationArticle.find_each do |article|
      next if article.public_uuid.present?

      article.update_columns(public_uuid: SecureRandom.uuid)
    end

    add_index :articles, :public_uuid, unique: true unless index_exists?(:articles, :public_uuid)
    change_column_null :articles, :public_uuid, false
  end

  def down
    remove_index :articles, :public_uuid if index_exists?(:articles, :public_uuid)
    remove_column :articles, :public_uuid if column_exists?(:articles, :public_uuid)
  end
end
