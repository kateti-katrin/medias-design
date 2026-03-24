(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    var area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.focus();
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    return Promise.resolve();
  }

  function mountBriefQuiz() {
    var form = document.getElementById("brief-quiz-form");
    var result = document.getElementById("brief-result");
    var output = document.getElementById("brief-output");
    var copyBtn = document.getElementById("brief-copy");
    if (!form || !result || !output || !copyBtn) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      var text = [
        "ТЕХНИЧЕСКОЕ ЗАДАНИЕ НА ДИЗАЙН",
        "",
        "1. Тип проекта: " + data.projectType,
        "2. Цель проекта: " + data.goal,
        "3. Целевая аудитория: " + data.audience,
        "4. Ключевое действие пользователя (CTA): " + data.cta,
        "5. Материалы по бренду: " + data.brand,
        "6. Обязательные блоки: " + data.blocks,
        "7. Желаемый срок запуска: " + data.deadline,
        "8. Дополнительные пожелания: " + (data.notes || "—"),
        "",
        "Ожидаемый результат:",
        "- Визуальное решение, соответствующее цели проекта и аудитории",
        "- Понятная структура контента по указанным блокам",
        "- Подготовка макетов для передачи в разработку"
      ].join("\n");

      output.textContent = text;
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    copyBtn.addEventListener("click", async function () {
      var text = output.textContent.trim();
      if (!text) return;
      await copyText(text);
      var oldLabel = copyBtn.textContent;
      copyBtn.textContent = "Скопировано";
      setTimeout(function () {
        copyBtn.textContent = oldLabel;
      }, 1400);
    });
  }

  function money(value) {
    return Math.round(value).toLocaleString("ru-RU") + " ₽";
  }

  function mountBudgetCalculator() {
    var form = document.getElementById("budget-form");
    var resultBox = document.getElementById("budget-result");
    var output = document.getElementById("budget-output");
    var copyBtn = document.getElementById("budget-copy");
    if (!form || !resultBox || !output || !copyBtn) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var raw = Object.fromEntries(new FormData(form).entries());
      var base = {
        landing: { label: "Лендинг", min: 45000, max: 80000, weeks: 2 },
        corporate: { label: "Корпоративный сайт", min: 90000, max: 170000, weeks: 4 },
        shop: { label: "Интернет-магазин", min: 130000, max: 260000, weeks: 6 },
        presentation: { label: "Презентация", min: 30000, max: 70000, weeks: 2 }
      }[raw.type] || { label: "Лендинг", min: 45000, max: 80000, weeks: 2 };

      var pages = Math.max(1, Number(raw.pages || 1));
      var min = base.min;
      var max = base.max;
      var weeks = base.weeks;
      var additions = [];

      var pagesFactor = 1 + (pages - 1) * 0.12;
      min *= pagesFactor;
      max *= pagesFactor;

      if (form.elements.brandbook.checked) {
        min += 25000;
        max += 55000;
        weeks += 1;
        additions.push("Фирменный стиль: +25 000 — 55 000 ₽");
      }

      if (form.elements.copywriting.checked) {
        min += 12000;
        max += 28000;
        additions.push("Тексты и редактура: +12 000 — 28 000 ₽");
      }

      if (form.elements.analytics.checked) {
        min += 15000;
        max += 35000;
        additions.push("Аналитика и структура: +15 000 — 35 000 ₽");
      }

      if (raw.urgency === "fast") {
        min *= 1.18;
        max *= 1.22;
        weeks = Math.max(1, weeks - 1);
        additions.push("Срочность x1.2");
      }

      if (raw.urgency === "rush") {
        min *= 1.35;
        max *= 1.45;
        weeks = Math.max(1, weeks - 2);
        additions.push("Очень срочно x1.4");
      }

      var text = [
        "ПРЕДВАРИТЕЛЬНЫЙ РАСЧЕТ БЮДЖЕТА",
        "",
        "Тип проекта: " + base.label,
        "Объем: " + pages + " экран(ов)/страниц",
        "Срок: около " + weeks + " нед.",
        "",
        "Бюджет: " + money(min) + " — " + money(max),
        "",
        "Что учтено:",
        "- Базовая стоимость для типа проекта",
        "- Масштаб по объему страниц/экранов"
      ];

      if (additions.length) {
        additions.forEach(function (item) {
          text.push("- " + item);
        });
      } else {
        text.push("- Без дополнительных опций");
      }

      text.push("");
      text.push("Комментарий:");
      text.push("Точная смета формируется после брифа и согласования состава работ.");

      output.textContent = text.join("\n");
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    copyBtn.addEventListener("click", async function () {
      var text = output.textContent.trim();
      if (!text) return;
      await copyText(text);
      var oldLabel = copyBtn.textContent;
      copyBtn.textContent = "Скопировано";
      setTimeout(function () {
        copyBtn.textContent = oldLabel;
      }, 1400);
    });
  }

  mountBriefQuiz();
  mountBudgetCalculator();
})();
