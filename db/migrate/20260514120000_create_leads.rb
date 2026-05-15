class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads do |t|
      t.string :kind, null: false                # "quote" или "brief"
      t.string :contact_email
      t.string :contact_name
      t.json :payload, null: false              # исходные параметры формы
      t.json :result                            # ответ сервера (текст ТЗ / расчёт)
      t.bigint :amount_min_cents                # для quote — минимальная сумма в копейках
      t.bigint :amount_max_cents                # для quote — максимальная сумма в копейках
      t.integer :duration_weeks                 # срок в неделях для quote
      t.string :ip_address
      t.string :user_agent, limit: 500
      t.timestamps
    end

    add_index :leads, :kind
    add_index :leads, :created_at
  end
end
