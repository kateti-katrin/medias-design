class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.string :title
      t.text :body
      t.string :slug

      t.timestamps
    end
  end
end
