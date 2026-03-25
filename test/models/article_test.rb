require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  test "generates slug and public_uuid for a new article" do
    article = Article.new(
      title: "Новая статья",
      excerpt: "Короткое описание",
      body: "Содержимое статьи",
      image: "article-large.png",
      primary_tag: tags(:task)
    )

    assert article.valid?
    assert_equal "novaya-statya", article.slug
    assert_match(/\A[0-9a-f\-]{36}\z/, article.public_uuid)
  end

  test "filters articles by tag name and slug" do
    assert_includes Article.by_tag("задача"), articles(:one)
    assert_includes Article.by_tag("otsenka"), articles(:two)
  end
end
