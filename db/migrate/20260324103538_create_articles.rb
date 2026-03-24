class CreateArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :excerpt
      t.string :tag
      t.string :image

      t.timestamps
    end
  end
end
