# СМЫСЛ — медиа о дизайне

Веб-приложение на Ruby on Rails 8. Медиа о дизайне для тех, кто его заказывает.

## Стек

| Технология | Версия |
|---|---|
| Ruby | 3.2.10 |
| Rails | 8.1.2.1 |
| База данных | SQLite3 |
| CSS | SCSS (cssbundling-rails + sass) |
| JavaScript | esbuild + React 18 + Hotwire Turbo |
| Asset pipeline | Propshaft |

## Архитектура

- **MVC**: контроллеры `Pages`, `Articles`, `Services`
- **Модели**: `Article` (статьи), `Service` (сервисы)
- **SCSS**: модульная структура `base → layout → components`
- **React**: компонент `ServicesApp` (интерактивные карточки сервисов)
- **Responsive**: breakpoints 1024px и 640px

## Установка и запуск

```bash
# 1. Установить зависимости Ruby
bundle install

# 2. Установить зависимости Node
npm install

# 3. Создать и подготовить базу данных
rails db:create db:migrate db:seed

# 4. Собрать assets (SCSS → CSS, JS + React → bundle)
npm run build
npm run build:css

# 5. Запустить сервер
rails server
# → http://localhost:3000
```

Или одной командой:
```bash
bin/dev
```

## Структура проекта

```
app/
  controllers/          — Pages, Articles, Services
  models/               — Article, Service
  views/
    pages/home.html.erb — главная страница
    articles/           — список и карточка статьи
    services/           — список и карточка сервиса
  assets/
    stylesheets/
      base/             — шрифты, переменные, reset
      layout/           — hero, page layout
      components/       — nav, buttons, articles, services, footer
    images/             — изображения из дизайна
    fonts/              — Bounded Bold (heading font)
  javascript/
    application.js      — entry point
    components/
      services_app.jsx  — React компонент
db/
  migrate/              — миграции Articles и Services
  seeds.rb              — демо-данные (4 статьи, 2 сервиса)
config/
  routes.rb             — root → pages#home, REST ресурсы
```

## Дизайн

Макет: Figma node 17:2. Все дизайн-токены — в `app/assets/stylesheets/base/_variables.scss`.
