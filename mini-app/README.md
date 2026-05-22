# СМЫСЛ — VK Mini App

Карманная версия [СМЫСЛа](../) — медиа о дизайне для не-дизайнеров
(предпринимателей, маркетологов, проджектов). Скелет VK Mini App,
который работает с Rails API основного проекта.

В смысле — с марта 2026.

## Стек

- React 19 + Webpack 5 (без Vite — по образцу учебного репозитория курса)
- Atomic Design: атомы (`A_`), молекулы (`M_`), организмы (`O_`), шаблоны (`T_`)
- CSS-модули по компонентам + PostCSS (`postcss-nested`, `autoprefixer`)
- JWT в `localStorage`, заголовок `Authorization: Bearer <token>`
- Минимальный собственный «роутер» (свой `pages` объект, как у Захара),
  без `react-router`

## Структура

```
mini-app/
├── package.json
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── postcss.config.js
├── .env.example
└── src/
    ├── index.html         — корневой HTML (без статики, всё рендерит React)
    ├── index.jsx          — точка входа, монтирует <App />
    ├── index.css          — собирает все стили через @import
    ├── App.jsx            — стейт + навигация между шаблонами
    ├── utilities.js       — fetchAPI + JWT хелперы
    ├── javascript/
    │   ├── components/    — A_*, M_*, O_*
    │   └── templates/     — T_SignIn, T_Articles, T_Article, T_Brief, T_Profile
    └── stylesheets/
        ├── reset.css, vars.css, fonts.css, basics.css
        ├── components/    — CSS на каждый компонент
        ├── templates/     — CSS на каждый шаблон
        └── layouts/       — L_CenteredForm, L_InternalPage
```

## Запуск

```bash
cd mini-app
npm install
cp .env.example .env       # при необходимости поменять URL Rails API
npm run dev                # webpack-dev-server на http://localhost:8080
```

> Rails API в основном проекте по умолчанию слушает `http://localhost:3000`.
> Запусти его параллельно: `bin/dev` или `rails s` из корня репозитория.

### Переменные окружения

| Переменная           | По умолчанию              | Что делает                             |
| -------------------- | ------------------------- | -------------------------------------- |
| `REACT_APP_API_URL`  | `http://localhost:3000`   | Куда mini-app шлёт запросы к Rails API |

Переменная прокидывается в код через `DefinePlugin` в `webpack.common.js`.

## Экраны

| Шаблон       | Что делает                                                        |
| ------------ | ----------------------------------------------------------------- |
| `T_SignIn`   | Логин по email/паролю → `POST /api/login`. Кладёт JWT в localStorage. |
| `T_Articles` | Список статей. `GET /api/articles`. Парсит `data: [...]`.         |
| `T_Article`  | Отдельная статья по id/slug. `GET /api/articles/:id`.             |
| `T_Brief`    | Локальный генератор ТЗ (5 вопросов → текстовая «рыба»).            |
| `T_Profile`  | Имя, email, выход (`DELETE /api/logout` + чистит localStorage).   |

## API

| Метод | Путь                  | Назначение                  |
| ----- | --------------------- | --------------------------- |
| POST  | `/api/login`          | вход по `{ user: { email, password } }` |
| DELETE| `/api/logout`         | выход                       |
| GET   | `/api/articles`       | список статей               |
| GET   | `/api/articles/:id`   | одна статья (id, slug или public_uuid) |
| GET   | `/api/ping`           | хелсчек                     |

## Нерешённые вопросы

1. **JWT vs session-cookie.** Согласно ТЗ скелет ждёт JWT в ответе на `/api/login`.
   Основной Rails сейчас отдаёт devise-сессию через cookie (см.
   `app/controllers/api/sessions_controller.rb`). Нужно либо подключить
   `devise-jwt`, либо переписать `handleSignInSubmit` на cookies + `credentials: 'include'`
   и настроить CORS.
2. **CORS.** В Rails-проекте на момент сборки скелета `rack-cors` не настроен.
   Перед первым запуском mini-app добавь его и разреши `http://localhost:8080`.
3. **VK Bridge.** Сейчас это просто React-приложение. Чтобы загрузить его
   как настоящий VK Mini App, добавь `@vkontakte/vk-bridge` и инициализацию
   в `src/index.jsx`.
4. **Шрифт.** Используется Inter из Google Fonts через `@import` — для
   офлайна/быстрой загрузки лучше положить локальные `.woff2`.
