require "test_helper"

class ApiArticlesTest < ActionDispatch::IntegrationTest
  test "returns articles list" do
    get api_articles_path

    assert_response :success
    payload = JSON.parse(response.body)
    assert_kind_of Array, payload["data"]
    assert payload["data"].any?
    assert payload["data"].first["slug"].present?
  end

  test "returns article by slug" do
    article = articles(:one)

    get api_article_path(article.slug)

    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal article.slug, payload.dig("data", "slug")
    assert_equal article.title, payload.dig("data", "title")
    assert_equal article.body, payload.dig("data", "body")
  end

  test "creates comment for article" do
    article = articles(:one)

    assert_difference -> { article.comments.count }, +1 do
      post api_article_comments_path(article), params: {
        comment: {
          author_name: "Тестовый пользователь",
          body: "Полезная статья, спасибо"
        }
      }, as: :json
    end

    assert_response :created
    payload = JSON.parse(response.body)
    assert_equal "Полезная статья, спасибо", payload.dig("data", "body")
  end

  test "returns validation error for invalid comment" do
    article = articles(:one)

    post api_article_comments_path(article), params: {
      comment: {
        author_name: "Тест",
        body: ""
      }
    }, as: :json

    assert_response :unprocessable_entity
    payload = JSON.parse(response.body)
    assert payload["errors"].any?
  end

  test "likes endpoint supports full lifecycle" do
    article = articles(:one)
    token = "test-visitor-001"

    get api_article_like_path(article), headers: { "X-Visitor-Token" => token }
    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal false, payload.dig("data", "liked")

    assert_difference -> { article.likes.count }, +1 do
      post api_article_like_path(article), headers: { "X-Visitor-Token" => token }
    end
    assert_response :created
    payload = JSON.parse(response.body)
    assert_equal true, payload.dig("data", "liked")

    assert_difference -> { article.likes.count }, -1 do
      delete api_article_like_path(article), headers: { "X-Visitor-Token" => token }
    end
    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal false, payload.dig("data", "liked")
  end
end
