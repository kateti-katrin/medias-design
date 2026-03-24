# СМЫСЛ — медиа о дизайне

Веб-приложение на Ruby on Rails 8. Проект содержит главную страницу, разделы статей и сервисов.

## Технологии

- Ruby 3.2.10
- Rails 8.1.2.1
- SQLite3
- SCSS (`cssbundling-rails` + `sass`)
- JavaScript (`esbuild`, `React 18`, `Turbo`, `Stimulus`)
- Propshaft

## Требования

- Ruby 3.2.10
- Node.js и npm
- Bundler

## Установка

```bash
bundle install
npm install
bin/rails db:create db:migrate db:seed
```

## Запуск в development

```bash
bin/dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

Альтернативно можно запускать процессы отдельно:

```bash
npm run build
npm run build:css
bin/rails server -p 3000
```

## Основные маршруты

- `/` — главная страница
- `/articles` — список статей
- `/articles/:id` — страница статьи
- `/services` — список сервисов
- `/services/:id` — страница сервиса
- `/up` — healthcheck

## Структура проекта

```text
app/
  controllers/
  models/
  views/
  assets/
  javascript/
config/
db/
test/
```

## Данные для разработки

Команда `bin/rails db:seed` добавляет тестовые записи в таблицы `articles` и `services`.

## Полезные команды

```bash
bin/rails test
bin/rubocop
```
