require "application_system_test_case"

class ArticlesTest < ApplicationSystemTestCase
  test "посетитель видит главную с навигацией" do
    visit root_path
    assert_text "СМЫСЛ", normalize_ws: true
  end

  test "посетитель видит список статей" do
    visit articles_path
    # На /articles должны быть все рубрики
    assert_text "задача"
  end

  test "посетитель открывает статью" do
    article = Article.first
    skip "Нет статей в БД — запусти rails db:seed" if article.nil?

    visit article_path(article)
    assert_text article.title
  end
end
