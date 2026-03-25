# СМЫСЛ

`СМЫСЛ` — учебный Ruby on Rails проект медиа-сайта о работе с дизайном.

## Что реализовано

- Главная страница с подборкой статей и сервисов
- Раздел `Статьи` с карточками и фильтрацией по тегам
- Страница статьи с трекингом просмотров, лайками и шарингом
- Два сервиса: генератор ТЗ и калькулятор бюджета
- Кастомная страница `404`
- Аутентификация пользователей через `Devise`

## API (JSON)

API находится под префиксом `/api`.

### Health и auth

- `GET /api/ping` — проверка статуса API
- `POST /api/login` — вход
- `DELETE /api/logout` — выход

### Articles

- `GET /api/articles` — список статей
- `GET /api/articles/:id` — статья по `slug`, `public_uuid` или числовому `id`

### Likes (запись в API)

- `GET /api/articles/:article_id/like` — статус лайка для посетителя
- `POST /api/articles/:article_id/like` — поставить лайк
- `DELETE /api/articles/:article_id/like` — снять лайк

Для идентификации посетителя используется заголовок `X-Visitor-Token` (или параметр `visitor_token`).

### Comments (запись в API)

- `GET /api/articles/:article_id/comments` — список комментариев статьи
- `POST /api/articles/:article_id/comments` — создать комментарий

Пример тела запроса:

```json
{
  "comment": {
    "author_name": "Иван",
    "body": "Спасибо за материал"
  }
}
```

## Локальный запуск

```bash
bundle install
npm install
bin/rails db:prepare
bin/dev
```

Приложение поднимется на `http://localhost:3000`.

## Тесты

```bash
bin/rails test
```

## Стек

- Ruby `3.2+`
- Rails `8.1`
- SQLite3
- SCSS (`cssbundling-rails`)
- JavaScript (`esbuild`, Turbo, Stimulus)
