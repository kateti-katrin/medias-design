class CreateFavouriteArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :favourite_articles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :article, null: false, foreign_key: true
      t.timestamps
    end

    add_index :favourite_articles, [:user_id, :article_id], unique: true
  end
end
