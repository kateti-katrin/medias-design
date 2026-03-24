# CLAUDE.md — site-001

## Проект
**site-001** — Rails 8 веб-приложение. Медиа о дизайне «СМЫСЛ».

## Стек
- Ruby 3.2.10 / Rails 8.1.2.1
- Propshaft (asset pipeline)
- SCSS (компилируется sass → app/assets/builds/application.css)
- esbuild (JS bundle → app/assets/builds/application.js)
- React 18 (через JSX, монтируется в #services-app)
- Hotwire Turbo + Stimulus
- SQLite3 (development)

## Архитектура
```
app/
  controllers/    — pages, articles, services
  models/         — Article, Service
  views/
    layouts/      — application.html.erb
    pages/        — home.html.erb (главная)
    articles/     — index, show
    services/     — index, show
  assets/
    stylesheets/
      base/       — _fonts, _variables, _reset
      layout/     — _hero, _page
      components/ — _nav, _buttons, _articles, _services, _footer
    images/       — все статические изображения
    fonts/        — Bounded-Bold.otf
    builds/       — скомпилированные CSS и JS (не коммитить!)
  javascript/
    application.js
    controllers/  — Stimulus
    components/   — React: services_app.jsx
db/
  migrate/        — 2 миграции: articles, services
  seeds.rb
config/
  routes.rb       — root → pages#home, resources :articles, :services
```

## Запуск
```bash
npm run build        # собрать JS
npm run build:css    # собрать SCSS → CSS
bin/rails server     # запустить сервер (порт 3000)
# или
bin/dev              # собрать + запустить
```

## Данные
```bash
rails db:seed        # 4 статьи + 2 сервиса
```

## Source of truth по визуалу
Figma node 17:2. Все дизайн-токены в SCSS → base/_variables.scss

## Локальный контекст проекта
`.claude/agents/site-context.md`

## Workflow
`D:\ROOT-9\playbooks\workflows\workflow-01-figma-to-html.md`
