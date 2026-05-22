json.data do
  json.partial! "api/articles/article", article: @article, include_body: true
end
