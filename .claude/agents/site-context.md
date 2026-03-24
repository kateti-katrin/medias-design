---
name: site-context
description: Локальный агент контекста проекта site-001. Rails 8 + React + SCSS. Стек, структура, ограничения и правила проекта.
tools: Read,Edit,MultiEdit,Grep,Glob
---

# SITE-001 LOCAL CONTEXT

## Назначение
Rails 8 веб-приложение «СМЫСЛ» — медиа о дизайне. Source of truth по визуалу: Figma node 17:2.

## Текущий стек
- Rails 8.1.2.1 / Ruby 3.2.10
- SCSS (cssbundling-rails + sass npm)
- React 18 + esbuild (jsbundling-rails)
- Hotwire Turbo + Stimulus
- Propshaft (asset pipeline)
- SQLite3 development

## Модели
- Article: title, excerpt, tag, image
- Service: title, body, slug

## Текущая структура проекта (ключевые файлы)
- app/views/pages/home.html.erb — главная страница (ERB)
- app/views/layouts/application.html.erb — layout
- app/assets/stylesheets/application.scss — SCSS entry point
- app/assets/stylesheets/base/ — переменные, шрифты, reset
- app/assets/stylesheets/layout/ — hero, page
- app/assets/stylesheets/components/ — nav, buttons, articles, services, footer
- app/assets/images/ — все изображения из Figma
- app/assets/fonts/ — Bounded-Bold.otf
- app/assets/builds/ — скомпилированный output (не редактировать вручную)
- app/javascript/application.js — JS entry point
- app/javascript/components/services_app.jsx — React компонент
- db/seeds.rb — демо-данные
- Procfile.dev — dev процессы
- package.json — npm зависимости

## Локальные правила
- не редактировать app/assets/builds/ напрямую — это сгенерированные файлы
- все стили разбиты по модулям в app/assets/stylesheets/
- изображения — только в app/assets/images/
- дизайн-токены — только в base/_variables.scss
- React только там, где нужна интерактивность; основная вёрстка — ERB
- после изменений SCSS запускать: npm run build:css
- после изменений JS/JSX запускать: npm run build

## Взаимодействие с глобальными агентами
- figma-agent: извлекает данные из Figma
- architect: проектирует реализацию
- builder: пишет код
- ui-auditor: проверяет качество UI
- integrator: собирает финальный результат
