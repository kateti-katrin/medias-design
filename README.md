# СМЫСЛ — медиа о продающем дизайне

«СМЫСЛ» — медиа про продающий дизайн для тех, кто его заказывает: владельцев бизнеса, менеджеров и команд, которые работают с подрядчиками и хотят лучше понимать процесс и бюджет.

## Сервисы проекта

1. Генератор ТЗ  
Сервис помогает собрать корректную задачу для дизайнера и снизить количество правок на старте.

2. Калькулятор бюджета  
Сервис помогает оценить ориентир стоимости и понять, из чего складывается цена работ.

## Техническая часть

### Стек и версии

- Ruby `3.2.10`
- Rails `8.1.2.1`
- SQLite3
- SCSS (`cssbundling-rails` + `sass`)
- JavaScript (`esbuild`, `React 18`, `Turbo`, `Stimulus`)
- Propshaft (asset pipeline)

### Что реализовано в коде

- Классическая MVC-структура на Rails: `Pages`, `Articles`, `Services`
- Главная страница + разделы статей и сервисов
- Модульная SCSS-архитектура: `base` → `layout` → `components`
- Подключен React-компонент для интерактивного сценария сервисов
- Сиды с демо-контентом для локальной разработки

### Реализованные технические компетенции

**Интернационализация и локализация**
- Полная русификация интерфейса: `I18n`, `russian` gem, `devise-i18n`
- Локаль по умолчанию — русский (`config.i18n.default_locale = :ru`)
- `config/locales/ru.yml` — переводы для Devise, ActiveRecord, UI

**Аутентификация**
- `Devise` — регистрация, вход, восстановление пароля
- Кастомные вьюшки Devise на русском языке (`app/views/devise/`)
- `devise-jwt` — JWT-токены для API, стратегия отзыва через `JwtDenylist`

**Загрузка и оптимизация изображений**
- `CarrierWave` — загрузка обложек статей (`ArticleCoverUploader`)
- `ruby-vips` + `image_processing` — оптимизация: JPEG Q=82, PNG compression=7, strip metadata
- Fallback-изображение при отсутствии загруженной обложки

**SEO**
- `meta-tags` gem — title, description, canonical, OpenGraph теги на всех страницах
- Кастомный `ApplicationHelper` с методами `set_meta_tags`, `meta_title`, `meta_og_*`

**URL и навигация**
- Человекочитаемые slug-URL из кириллического заголовка (транслитерация + `parameterize`)
- Метод `to_param` в модели `Article` — Rails использует slug вместо числового id

**Структура данных**
- Полиморфные ассоциации: модель `Like` (likeable_type + likeable_id)
- Вложенные формы (nested forms): `User` → `Profile` через `fields_for` и `accepts_nested_attributes_for`
- Self-join: `Comment` — древовидная структура (parent → replies)
- STI (Single Table Inheritance): `GuideArticle`, `ReviewArticle`, `ProcessArticle`, `PricingArticle`
- Scopes в моделях: `by_tag`, `newest_first`, `recent`, `with_primary_tag`
- Система тегов: модель `Tag` с FK, slug, уникальностью и фильтрацией

**API и безопасность**
- API-режим: `Api::BaseController < ActionController::API`
- `rack-cors` — настройка CORS для API-запросов
- JWT авторизация: `POST /api/login`, `DELETE /api/logout`
- `config/credentials.yml.enc` — зашифрованные секреты (JWT-ключ, mailer)
- UUID (`public_uuid`) на каждой записи статьи

**Счётчики и сессии**
- Серверный счётчик просмотров (`views_count`) с дедупликацией через сессии
- Signed cookies — история последних прочитанных статей (30 дней)
