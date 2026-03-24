# Seeds — site-001 demo data

Article.destroy_all
Service.destroy_all

Article.create!([
  {
    title:   "Как поставить задачу дизайнеру, чтобы не переделывать 3 раза",
    excerpt: "Шаблон задачи, который спасёт вас от бесконечных правок.",
    tag:     "задача",
    image:   "article-large.png"
  },
  {
    title:   "Что ломает лендинг ещё до первого экрана",
    excerpt: "Три ошибки на старте, из-за которых посетители уходят ещё до скрола.",
    tag:     "оценка",
    image:   "article-small.png"
  },
  {
    title:   "Почему один и тот же сайт стоит по‑разному",
    excerpt: "Разбираем из чего складывается цена и как не переплатить.",
    tag:     "деньги",
    image:   "article-small.png"
  },
  {
    title:   "Почему правки в дизайне съедают сроки и результат",
    excerpt: "Как выстроить процесс согласования без бесконечных кругов.",
    tag:     "процесс",
    image:   "article-large.png"
  }
])

Service.create!([
  {
    title: "без тз результат хз",
    body:  "Ответьте на несколько вопросов и получите готовую задачу для дизайнера.",
    slug:  "brief"
  },
  {
    title: "Калькулятор бюджета",
    body:  "Получите ориентир по стоимости и поймите, откуда берётся разброс в цене.",
    slug:  "calculator"
  }
])

puts "Seeded #{Article.count} articles, #{Service.count} services."
