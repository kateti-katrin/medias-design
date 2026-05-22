class CreateReactions < ActiveRecord::Migration[8.1]
  def change
    create_table :reactions do |t|
      t.references :article, null: false, foreign_key: true
      t.references :user, foreign_key: true                        # nil = аноним
      t.string :visitor_token                                       # для анонимных
      t.string :kind, null: false                                   # fire / heart / mind / lol / wow
      t.timestamps
    end

    add_index :reactions, [:article_id, :kind]
    add_index :reactions, [:user_id, :article_id, :kind], unique: true, where: "user_id IS NOT NULL", name: "idx_user_article_kind"
    add_index :reactions, [:visitor_token, :article_id, :kind], unique: true, where: "visitor_token IS NOT NULL", name: "idx_token_article_kind"
  end
end
