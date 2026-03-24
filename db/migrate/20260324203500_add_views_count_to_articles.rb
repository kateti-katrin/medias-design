class AddViewsCountToArticles < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :views_count, :integer, null: false, default: 0 unless column_exists?(:articles, :views_count)
  end
end
