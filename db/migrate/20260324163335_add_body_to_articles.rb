class AddBodyToArticles < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :body, :text
  end
end
