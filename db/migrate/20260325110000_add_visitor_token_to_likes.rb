class AddVisitorTokenToLikes < ActiveRecord::Migration[8.1]
  class MigrationLike < ApplicationRecord
    self.table_name = "likes"
  end

  def up
    add_column :likes, :visitor_token, :string unless column_exists?(:likes, :visitor_token)

    MigrationLike.reset_column_information

    MigrationLike.find_each do |like|
      next if like.visitor_token.present?

      like.update_columns(visitor_token: "legacy-#{like.id}-#{SecureRandom.hex(6)}")
    end

    change_column_null :likes, :visitor_token, false
    add_index :likes, [:likeable_type, :likeable_id, :visitor_token], unique: true, name: "index_likes_on_likeable_and_visitor"
  end

  def down
    remove_index :likes, name: "index_likes_on_likeable_and_visitor" if index_exists?(:likes, name: "index_likes_on_likeable_and_visitor")
    remove_column :likes, :visitor_token if column_exists?(:likes, :visitor_token)
  end
end
