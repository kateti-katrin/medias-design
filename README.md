# СМЫСЛ

Медиа-сервис о дизайне для тех, кто его заказывает: предпринимателей, маркетологов, проджектов. Учим понимать дизайн без обязательного дизайнерского бэкграунда.

## Архитектура

Проект состоит из **трёх частей**, которые живут в одном репозитории:

1. **Rails веб-приложение** (основное) — `app/`, `config/`, `db/`. Веб-сайт с View-слоем (ERB) и REST API на одном бэкенде. Это и есть «продукт».
2. **REST API** для внешних клиентов (Mini App, мобильные приложения) — `app/controllers/api/`. JSON, JWT-auth через `devise-jwt`, CORS.
3. **VK Mini App** — отдельный React-проект в папке `mini-app/`. Работает с Rails API, в продакшен пока не выкатывается.

Плюс — статическая «витрина» на GitHub Pages (`index.html`, `articles/*.html`, `services/*.html`, `login.html`, `profile.html`, `pricing.html`, `404.html`, `404-v2.html`). Это публичный лендинг и презентация концепции. Боевая логика — на Rails.

## Стек

| Слой | Технологии |
|---|---|
| Бэкенд | Ruby on Rails 8.1, SQLite3, Solid Queue/Cache/Cable |
| Аутентификация | Devise + devise-jwt + JwtDenylist |
| Фронт (Rails) | ERB + Turbo + Stimulus + esbuild + SCSS |
| Загрузка картинок | CarrierWave + ruby-vips + image_processing |
| Rich-content статей | Action Text + Active Storage |
| Пагинация | will_paginate |
| API | jbuilder, rack-cors, meta-tags |
| Mini App | React + Webpack, Atomic Design (A_/M_/O_/T_) |

## Модели данных

- `Article` (со STI: `GuideArticle`, `PricingArticle`, `ProcessArticle`, `ReviewArticle`) — статья со slug, public_uuid, обложкой, тегом, body
- `Tag` — рубрика статьи (4 базовых: задача / оценка / деньги / процесс)
- `Comment` — комментарии под статьями
- `Like` (polymorphic) — лайки (как-likeable)
- `FavouriteArticle` — избранные статьи у пользователя
- `Reaction` — реакции под статьёй (🔥 ❤️ 🤯 😆 👀) для зарегистрированных и анонимов
- `User` (Devise) — аккаунт
- `Profile` — отображаемое имя, био, аватар у `User`
- `JwtDenylist` — отзыв JWT-токенов

## Веб-маршруты (View)

- `/` — главная (pages#home)
- `/articles` — список статей с пагинацией и фильтрами по рубрикам
- `/articles/:slug` — страница статьи с лайками, реакциями, избранным
- `/articles/:slug/toggle_favourite` — ★ в избранное
- `/articles/:slug/toggle_reaction/:kind` — реакция (🔥 ❤️ 🤯 😆 👀)
- `/services/brief` — генератор ТЗ
- `/services/calculator` — калькулятор бюджета
- `/users/sign_in` — вход (Devise)
- `/users/sign_up` — регистрация (Devise)
- `/profile` — кабинет пользователя
- `/profile/edit` — редактировать профиль
- `/favourites` — мои избранные

## API-маршруты

| Метод | Путь | Что делает |
|---|---|---|
| `GET` | `/api/ping` | healthcheck |
| `POST` | `/api/login` | логин → JWT в заголовке Authorization |
| `DELETE` | `/api/logout` | выход (JWT в denylist) |
| `GET` | `/api/articles` | список статей JSON |
| `GET` | `/api/articles/:id` | одна статья (id может быть slug/uuid) |
| `GET/POST/DELETE` | `/api/articles/:id/like` | лайк (toggle) |
| `GET/POST` | `/api/articles/:id/comments` | комментарии |
| `POST/DELETE` | `/api/articles/:id/favourite` | избранное (toggle) |
| `GET/POST` | `/api/articles/:id/reactions` | реакции (POST с `kind`) |
| `GET` | `/api/favourites` | мои избранные |
| `GET` | `/api/profile` | мой профиль |

## Как запустить локально

```bash
# Один раз
bundle install
npm install
bundle exec rails db:prepare db:seed

# Запуск (Rails + JS-bundler + CSS-bundler)
bin/dev
# или
bundle exec rails server -p 3000
```

Откроется на http://localhost:3000

Mini App:
```bash
cd mini-app
npm install
npm run dev   # http://localhost:8080
```

## Структура

```
.
├── app/
│   ├── controllers/
│   │   ├── api/                       # JSON API для Mini App и внешних клиентов
│   │   │   ├── articles_controller.rb
│   │   │   ├── article_likes_controller.rb
│   │   │   ├── article_comments_controller.rb
│   │   │   ├── favourites_controller.rb
│   │   │   ├── reactions_controller.rb
│   │   │   ├── profile_controller.rb
│   │   │   ├── sessions_controller.rb  # POST /api/login (JWT)
│   │   │   ├── health_controller.rb
│   │   │   └── base_controller.rb
│   │   ├── articles_controller.rb     # Веб: /articles, /articles/:slug
│   │   ├── pages_controller.rb        # Главная
│   │   ├── services_controller.rb     # Brief + Calculator
│   │   ├── profile_controller.rb      # /profile
│   │   └── favourites_controller.rb   # /favourites
│   ├── models/
│   ├── views/
│   └── javascript/components/         # esbuild-бандл, Stimulus-контроллеры
├── config/
│   ├── routes.rb
│   ├── initializers/
│   │   ├── devise.rb                  # JWT + Devise
│   │   ├── cors.rb                    # CORS для /api/*
│   │   └── content_security_policy.rb
│   └── deploy.yml                     # Kamal config (для будущего деплоя)
├── db/migrate/                        # миграции (включая favourite_articles, reactions, action_text)
├── mini-app/                          # 🔥 Отдельный React-проект для VK Mini App
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── utilities.js               # fetchAPI(), token storage
│   │   └── javascript/
│   │       ├── components/            # Atoms (A_*), Molecules (M_*), Organisms (O_*)
│   │       └── templates/             # Templates (T_*)
│   ├── webpack.common.js
│   └── package.json
├── index.html, articles/, services/   # Статическая витрина (GitHub Pages)
└── 404.html, 404-v2.html, pricing.html, login.html, profile.html
```

## Демо для предпросмотра

1. **Открываем http://localhost:3000** — главная сайта (Rails View).
2. **Кликаем «Читать»** → `/articles` — список статей с фильтрами, пагинацией.
3. **Открываем любую статью** → `/articles/:slug` — рассказ, лайки, реакции (🔥 ❤️ 🤯 😆 👀), кнопка ★ в избранное, комментарии.
4. **Жмём «Войти»** → `/users/sign_in` — стилизованная форма Devise.
5. **Регистрируемся** → создаётся `User` + `Profile`.
6. **Переходим в /profile** — кабинет: аватар, статы (избранное, реакции, всего статей), список избранного.
7. **Из статьи жмём ★** — статья появляется в избранном.
8. **Открываем `/api/articles`** — тот же контент, но в JSON.
9. **Из Postman/curl делаем `POST /api/login`** с email+password → получаем JWT в заголовке `Authorization`.
10. **С этим JWT делаем `GET /api/favourites`** — то же избранное, но JSON для Mini App.
11. **Показываем `mini-app/`** — папка с отдельным React-проектом, который ходит в Rails API.

## Что осталось доделать (после предпросмотра)

- Action Text-редактор подключить в админку статей (сейчас миграции есть, но интерфейса нет)
- Stimulus-контроллеры для toggle-favourite / toggle-reaction (сейчас работает через `redirect_back`)
- VK Bridge подключить в Mini App для реального запуска внутри VK
- Развернуть Rails на DigitalOcean Droplet через Kamal (как в лекциях)
- Share-image генерация через Active Job для соцсетей
