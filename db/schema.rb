# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_22_083028) do
  create_table "action_text_rich_texts", force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "articles", force: :cascade do |t|
    t.text "body"
    t.string "cover_image"
    t.datetime "created_at", null: false
    t.text "excerpt"
    t.string "image"
    t.string "public_uuid", null: false
    t.string "slug", null: false
    t.string "tag"
    t.integer "tag_id", null: false
    t.string "title"
    t.string "type"
    t.datetime "updated_at", null: false
    t.integer "views_count", default: 0, null: false
    t.index ["public_uuid"], name: "index_articles_on_public_uuid", unique: true
    t.index ["slug"], name: "index_articles_on_slug", unique: true
    t.index ["tag_id"], name: "index_articles_on_tag_id"
    t.index ["type"], name: "index_articles_on_type"
  end

  create_table "comments", force: :cascade do |t|
    t.integer "article_id", null: false
    t.string "author_name"
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.integer "parent_id"
    t.datetime "updated_at", null: false
    t.index ["article_id", "created_at"], name: "index_comments_on_article_id_and_created_at"
    t.index ["article_id"], name: "index_comments_on_article_id"
    t.index ["parent_id", "created_at"], name: "index_comments_on_parent_id_and_created_at"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
  end

  create_table "favourite_articles", force: :cascade do |t|
    t.integer "article_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["article_id"], name: "index_favourite_articles_on_article_id"
    t.index ["user_id", "article_id"], name: "index_favourite_articles_on_user_id_and_article_id", unique: true
    t.index ["user_id"], name: "index_favourite_articles_on_user_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "exp", null: false
    t.string "jti", null: false
    t.datetime "updated_at", null: false
    t.index ["exp"], name: "index_jwt_denylists_on_exp"
    t.index ["jti"], name: "index_jwt_denylists_on_jti", unique: true
  end

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "likeable_id", null: false
    t.string "likeable_type", null: false
    t.datetime "updated_at", null: false
    t.string "visitor_token", null: false
    t.index ["likeable_type", "likeable_id", "visitor_token"], name: "index_likes_on_likeable_and_visitor", unique: true
    t.index ["likeable_type", "likeable_id"], name: "index_likes_on_likeable"
  end

  create_table "profiles", force: :cascade do |t|
    t.string "avatar_url"
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "display_name"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id", unique: true
  end

  create_table "reactions", force: :cascade do |t|
    t.integer "article_id", null: false
    t.datetime "created_at", null: false
    t.string "kind", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "visitor_token"
    t.index ["article_id", "kind"], name: "index_reactions_on_article_id_and_kind"
    t.index ["article_id"], name: "index_reactions_on_article_id"
    t.index ["user_id", "article_id", "kind"], name: "idx_user_article_kind", unique: true, where: "user_id IS NOT NULL"
    t.index ["user_id"], name: "index_reactions_on_user_id"
    t.index ["visitor_token", "article_id", "kind"], name: "idx_token_article_kind", unique: true, where: "visitor_token IS NOT NULL"
  end

  create_table "services", force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.string "slug"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
    t.index ["slug"], name: "index_tags_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "articles", "tags"
  add_foreign_key "comments", "articles"
  add_foreign_key "comments", "comments", column: "parent_id"
  add_foreign_key "favourite_articles", "articles"
  add_foreign_key "favourite_articles", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "reactions", "articles"
  add_foreign_key "reactions", "users"
end
