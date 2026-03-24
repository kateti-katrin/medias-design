class CreateLikes < ActiveRecord::Migration[8.1]
  def change
    create_table :likes do |t|
      t.references :likeable, polymorphic: true, null: false, index: true

      t.timestamps
    end
  end
end
