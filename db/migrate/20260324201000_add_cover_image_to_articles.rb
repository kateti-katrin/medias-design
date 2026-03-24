class AddCoverImageToArticles < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :cover_image, :string unless column_exists?(:articles, :cover_image)
  end
end
