json.extract! article,
              :id,
              :public_uuid,
              :slug,
              :title,
              :excerpt,
              :views_count

json.tag           article.primary_tag&.name || article.tag
json.image_url     article.image
json.likes_count   article.likes.size
json.comments_count article.comments.size
json.created_at    article.created_at&.iso8601

# Тело статьи отдаём только в show (не в списке)
json.body article.body if local_assigns[:include_body]
