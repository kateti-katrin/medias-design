# ARCHITECT PLAN — node 17:2 / site-001

## Источник
Handoff на основе Figma node 17:2 (frame "новый"), 1440px desktop layout.
Figma повторно не анализировался.

---

## 1. Файлы проекта

| Файл | Назначение |
|---|---|
| `index.html` | единственная HTML-страница |
| `styles.css` | все стили, организованы по секциям |
| `assets/` | все изображения (экспортировать из Figma API до вёрстки) |

Новых файлов не создавать. JS не подключать.

---

## 2. Структура HTML-секций

```html
<body>
  <header class="site-header">        <!-- Hero: логотип + nav + hero-content -->
    <div class="hero-bg">             <!-- фоновое изображение + overlay -->
    <div class="logo">                <!-- логотип СМЫСЛ -->
    <nav class="site-nav">            <!-- главная / Статьи / Задача / бюджет / о нас -->
    <div class="hero-content">        <!-- label + H1 + CTA-кнопка -->
    <p class="hero-tagline">          <!-- "Пишем о продающем визуале" -->
  </header>

  <main>
    <section class="about">           <!-- текст 33px + кнопка "о проекте" -->
    <section class="articles">        <!-- сетка карточек статей -->
    <section class="services">        <!-- заголовок + 2 service-блока -->
  </main>

  <footer class="site-footer">        <!-- логотип + tagline + nav -->
  </footer>
</body>
```

### Article card (повторяющийся паттерн)
```html
<article class="article-card article-card--large | article-card--small">
  <div class="article-card__image">   <!-- img + маска через CSS -->
  <div class="article-card__body">
    <p class="article-card__tag">     <!-- [ категория ] -->
    <p class="article-card__title">   <!-- заголовок 25px -->
```

### Service block (повторяющийся паттерн)
```html
<div class="service-block service-block--left | service-block--right">
  <div class="service-block__content">
    <hr class="divider">
    <h2 class="service-block__heading">
    <p class="service-block__body">
    <a class="btn btn--primary">
  <div class="service-block__image">  <!-- img + маска через CSS -->
```

---

## 3. CSS Custom Properties

Все токены — в `:root {}` в начале `styles.css`.

```css
:root {
  /* Colors */
  --color-bg:           #111111;
  --color-text:         #fcf8c9;
  --color-overlay-hero: rgba(0, 0, 0, 0.4);
  --color-overlay-card: rgba(17, 17, 17, 0.2);
  --color-overlay-foot: rgba(0, 0, 0, 0.3);
  --color-border:       #fcf8c9;
  --color-border-image: rgba(216, 216, 216, 0.1);

  /* Typography — families */
  --font-heading: 'Bounded', sans-serif;
  --font-body:    'Inter', sans-serif;

  /* Typography — sizes */
  --text-hero-h1:      70px;
  --text-section-h:    80px;
  --text-service-h:    60px;
  --text-body-large:   33px;
  --text-body-medium:  25px;
  --text-body-base:    18px;
  --text-label:        14px;
  --text-nav:          18px;

  /* Typography — misc */
  --lh-heading:  1.08;
  --lh-body:     1.2;
  --tracking-xl: -1.6px;
  --tracking-lg: -1.4px;
  --tracking-md: -1.2px;
  --tracking-nav: -0.36px;

  /* Spacing */
  --gap-section:  270px;
  --gap-group:    180px;
  --gap-block:    90px;
  --gap-element:  30px;
  --gap-tight:    20px;

  /* Layout */
  --site-width:    1440px;
  --content-width: 1380px;
  --col-large:     820px;
  --col-small:     400px;
  --col-text:      680px;
  --col-service-body: 400px;

  /* Buttons */
  --btn-primary-width: 400px;
  --btn-small-width:   120px;
  --btn-px:            100px;
  --btn-py:            8px;

  /* Hero */
  --hero-height: 820px;
}
```

---

## 4. Layout: организация секций

### 4.1 Hero
- `<header>` с `position: relative`, `height: var(--hero-height)`, `overflow: hidden`.
- `.hero-bg` — `position: absolute; inset: 0` с `<img>` внутри (object-fit: cover) и псевдоэлементом `::after` для overlay.
- Логотип — `position: absolute; top: 30px; left: 32px`.
- Nav — `position: absolute; top: 286px; left: 30px; width: 100%`. Внутри flex с `justify-content: space-between` (5 пунктов).
- `.hero-content` — `position: absolute; bottom` от расчёта (top: 457px), `left: 30px; width: 960px`.
- `.hero-tagline` — `position: absolute; top: 670px; right` (расчёт от 1440px).

### 4.2 About
- `max-width: var(--content-width); margin: 0 auto`.
- Текст 33px, `max-width: var(--col-text)`.
- Кнопка "о проекте" — `width: var(--btn-small-width)`.

### 4.3 Articles grid
- Обёртка `.articles-grid` — `display: flex; flex-direction: column; gap: var(--gap-group)`.
- Каждый ряд — `display: flex; justify-content: space-between; align-items: flex-start`.
- `.article-card--large` — `width: var(--col-large)`.
- `.article-card--small` — `width: var(--col-small)`.
- Порядок рядов: ряд 1 — large+small; ряд 2 — small+large.

### 4.4 Services
- Заголовок 80px — `width: 100%; text-align: left`.
- Sub-text 33px — `width: var(--col-text); align-self: flex-end` (правый край).
- Каждый `.service-block` — `display: flex; justify-content: space-between; align-items: center`.
  - `.service-block--left`: content слева, image справа.
  - `.service-block--right`: image слева, content справа.
- `.service-block__content` — `width: var(--col-text)`.
- `.service-block__image` — `width: var(--col-text)` (зеркально).

### 4.5 Footer
- `position: relative; background: var(--color-overlay-foot)`.
- Внутри flex-колонка или grid: логотип (ширина 540px) + tagline справа + nav снизу.
- Nav — аналогично header nav.

---

## 5. Маскированные изображения

**Подход (без JS, CSS-only):**
- Использовать `clip-path` или `mask-image` на `<img>` / wrapper.
- Для прямоугольных масок — `border-radius` или `overflow: hidden` достаточно.
- Для нестандартных форм — `mask-image: url(assets/mask-shape.svg)`.

**Допущение (до уточнения):** если маски имеют произвольную форму из Figma — экспортировать SVG-маски в `assets/`, применять через `mask-image`. Если форма прямоугольная с закруглениями — использовать `border-radius` + `overflow: hidden`.

---

## 6. Шрифты — допущения до уточнения

| Шрифт | Статус | Допущение |
|---|---|---|
| `Bounded Bold` | не стандартный, источник неизвестен | временно заменить на `system-ui` (bold), зарезервировать через `@font-face` как только файл будет предоставлен |
| `Inter Regular` | доступен на Google Fonts | подключить через `<link>` Google Fonts |
| `Inter Medium` | доступен на Google Fonts (weight: 500) | подключить вместе с Regular одним запросом |

Строка подключения Inter:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap
```

`Bounded` — ждать файл от заказчика. До получения: `font-family: var(--font-heading)` работает с fallback.

---

## 7. Responsive — допущения

В макете breakpoints отсутствуют. Принимаемые допущения:

- Текущий цикл вёрстки — **только desktop 1440px**.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` подключить.
- Оборачивать контент в `.container` с `max-width: var(--site-width); margin: 0 auto` — это подготовит адаптив в будущем.
- Абсолютное позиционирование в hero ограничить `position: relative` на wrapper — не использовать `position: fixed` или viewport-единицы без необходимости.
- Мобильный breakpoint — **отдельный цикл** после согласования макета.

---

## 8. Порядок реализации для builder

```
Шаг 1 — Подготовка
  [ ] Экспортировать все изображения из Figma API в assets/
  [ ] Экспортировать SVG-маски (если нестандартные формы) в assets/
  [ ] Подключить Google Fonts (Inter 400, 500)
  [ ] Зарезервировать @font-face для Bounded (пустой, с fallback)

Шаг 2 — Базовая структура
  [ ] Написать HTML-скелет всех секций (без стилей)
  [ ] Верифицировать семантику (header, main, section, footer, nav, article)

Шаг 3 — CSS custom properties
  [ ] Прописать все переменные в :root
  [ ] Добавить reset (box-sizing: border-box, margin: 0, padding: 0)

Шаг 4 — Hero
  [ ] Фоновое изображение + overlay
  [ ] Логотип (абсолютно)
  [ ] Nav (абсолютно)
  [ ] hero-content (label + H1 + CTA)
  [ ] hero-tagline

Шаг 5 — About
  [ ] Текст + кнопка "о проекте"

Шаг 6 — Articles grid
  [ ] Ряд 1: large + small
  [ ] Ряд 2: small + large
  [ ] Маски на изображениях

Шаг 7 — Services
  [ ] Заголовок секции + sub-text
  [ ] Service 1 (content left, image right)
  [ ] Service 2 (image left, content right)
  [ ] Divider линии

Шаг 8 — Footer
  [ ] Логотип + tagline + nav

Шаг 9 — Финальная проверка
  [ ] Сверить с Figma-скриншотом node 17:2
  [ ] Проверить все CSS-переменные использованы (нет хардкода цветов/размеров)
  [ ] Проверить отсутствие inline styles и JS
```

---

## 9. Открытые вопросы (блокеры перед вёрсткой)

| # | Вопрос | Кто отвечает |
|---|---|---|
| 1 | Файл шрифта `Bounded Bold` — где взять? | заказчик |
| 2 | Маски карточек — произвольная форма или прямоугольник? | уточнить в Figma |
| 3 | Page name в Figma-файле | пользователь |
| 4 | Есть ли мобильный макет? | заказчик |
| 5 | Логотип СМЫСЛ — SVG или PNG? | уточнить при экспорте |
