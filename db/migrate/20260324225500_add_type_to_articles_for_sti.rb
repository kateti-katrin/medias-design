class AddTypeToArticlesForSti < ActiveRecord::Migration[8.1]
  class MigrationArticle < ApplicationRecord
    self.table_name = "articles"
  end

  TYPE_BY_TAG = {
    "задача" => "GuideArticle",
    "оценка" => "ReviewArticle",
    "процесс" => "ProcessArticle",
    "деньги" => "PricingArticle"
  }.freeze

  def up
    add_column :articles, :type, :string unless column_exists?(:articles, :type)

    MigrationArticle.reset_column_information

    MigrationArticle.find_each do |article|
      tag = article.tag.to_s.strip.downcase
      mapped_type = TYPE_BY_TAG[tag] || "Article"
      article.update_columns(type: mapped_type)
    end

    add_index :articles, :type unless index_exists?(:articles, :type)
  end

  def down
    remove_index :articles, :type if index_exists?(:articles, :type)
    remove_column :articles, :type if column_exists?(:articles, :type)
  end
end
