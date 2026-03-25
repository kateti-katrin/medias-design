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

  /* ── Brief quiz ─────────────────────────────────────────────────── */

  function buildBrief(data) {
    var brandNote =
      data.brand === "Есть брендбук и готовые материалы"
        ? "Фирменный стиль готов — брендбук и материалы предоставим."
        : data.brand === "Есть логотип, но нет системы"
        ? "Есть логотип, но единого стиля нет. Нужно выстроить систему."
        : "Фирменного стиля нет. Потребуется разработка с нуля.";

    var notesLine = (data.notes || "").trim()
      ? "\nДополнительно\n" + data.notes.trim()
      : "";

    return [
      "ТЕХНИЧЕСКОЕ ЗАДАНИЕ НА ДИЗАЙН",
      "",
      "Проект: " + data.projectType,
      "Срок запуска: " + data.deadline,
      "",
      "Задача",
      data.goal.trim(),
      "",
      "Целевая аудитория",
      data.audience.trim(),
      "",
      "Ключевое действие пользователя",
      data.cta,
      "",
      "Фирменный стиль",
      brandNote,
      "",
      "Состав страницы / экранов",
      data.blocks.trim() + notesLine,
      "",
      "Ожидаемый результат: готовые макеты для передачи в разработку, соответствующие цели проекта и аудитории."
    ].join("\n");
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
      output.textContent = buildBrief(data);
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    copyBtn.addEventListener("click", async function () {
      var text = output.textContent.trim();
      if (!text) return;
      await copyText(text);
      var oldLabel = copyBtn.textContent;
      copyBtn.textContent = "Скопировано";
      setTimeout(function () { copyBtn.textContent = oldLabel; }, 1400);
    });
  }

  /* ── Budget calculator ──────────────────────────────────────────── */

  function money(value) {
    return Math.round(value).toLocaleString("ru-RU") + " ₽";
  }

  var BASE = {
    freelancer: {
      landing:      { label: "Лендинг",            min: 30000,  max: 55000,  weeks: 2 },
      corporate:    { label: "Корпоративный сайт", min: 60000,  max: 110000, weeks: 4 },
      shop:         { label: "Интернет-магазин",    min: 80000,  max: 150000, weeks: 5 },
      presentation: { label: "Презентация",         min: 20000,  max: 45000,  weeks: 2 }
    },
    agency: {
      landing:      { label: "Лендинг",            min: 65000,  max: 130000, weeks: 3 },
      corporate:    { label: "Корпоративный сайт", min: 140000, max: 260000, weeks: 6 },
      shop:         { label: "Интернет-магазин",    min: 200000, max: 390000, weeks: 8 },
      presentation: { label: "Презентация",         min: 50000,  max: 110000, weeks: 3 }
    }
  };

  function calcFor(type, pages, data, tier) {
    var project = (BASE[tier][type] || BASE[tier].landing);
    var min = project.min;
    var max = project.max;
    var weeks = project.weeks;

    var pagesFactor = 1 + (pages - 1) * 0.12;
    min *= pagesFactor;
    max *= pagesFactor;

    var additions = [];

    if (data.brandbook) {
      var bbMin = tier === "freelancer" ? 15000 : 35000;
      var bbMax = tier === "freelancer" ? 30000 : 70000;
      min += bbMin; max += bbMax; weeks += 1;
      additions.push("Фирменный стиль: +" + money(bbMin) + " — " + money(bbMax));
    }
    if (data.copywriting) {
      var cpMin = tier === "freelancer" ? 8000 : 18000;
      var cpMax = tier === "freelancer" ? 18000 : 38000;
      min += cpMin; max += cpMax;
      additions.push("Тексты: +" + money(cpMin) + " — " + money(cpMax));
    }
    if (data.analytics) {
      var anMin = tier === "freelancer" ? 10000 : 22000;
      var anMax = tier === "freelancer" ? 20000 : 45000;
      min += anMin; max += anMax;
      additions.push("Аналитика: +" + money(anMin) + " — " + money(anMax));
    }

    if (data.urgency === "fast") {
      min *= 1.2; max *= 1.2;
      weeks = Math.max(1, weeks - 1);
      additions.push("Срочность: +20%");
    }
    if (data.urgency === "rush") {
      min *= 1.4; max *= 1.4;
      weeks = Math.max(1, weeks - 2);
      additions.push("Очень срочно: +40%");
    }

    return { min: min, max: max, weeks: weeks, additions: additions, label: project.label };
  }

  function addsList(items) {
    return items.length
      ? items.map(function (a) { return "  · " + a; }).join("\n")
      : "  · Без дополнительных опций";
  }

  function budgetText(data, fl, ag) {
    return [
      "ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ БЮДЖЕТА",
      "",
      "Проект: " + fl.label + ", " + data.pages + " экр./стр.",
      "",
      "── Фрилансер ──────────────────────",
      "Бюджет: " + money(fl.min) + " — " + money(fl.max),
      "Срок:   ~" + fl.weeks + " нед.",
      "Что учтено:",
      addsList(fl.additions),
      "",
      "── Агентство ──────────────────────",
      "Бюджет: " + money(ag.min) + " — " + money(ag.max),
      "Срок:   ~" + ag.weeks + " нед.",
      "Что учтено:",
      addsList(ag.additions),
      "",
      "Это ориентир. Финальная смета — после брифа и согласования состава работ."
    ].join("\n");
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
      var data = {
        type: raw.type,
        pages: Math.max(1, Number(raw.pages || 1)),
        urgency: raw.urgency,
        brandbook: form.elements.brandbook.checked,
        copywriting: form.elements.copywriting.checked,
        analytics: form.elements.analytics.checked
      };

      var fl = calcFor(data.type, data.pages, data, "freelancer");
      var ag = calcFor(data.type, data.pages, data, "agency");

      output.textContent = budgetText(data, fl, ag);
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    copyBtn.addEventListener("click", async function () {
      var text = output.textContent.trim();
      if (!text) return;
      await copyText(text);
      var oldLabel = copyBtn.textContent;
      copyBtn.textContent = "Скопировано";
      setTimeout(function () { copyBtn.textContent = oldLabel; }, 1400);
    });
  }

  mountBriefQuiz();
  mountBudgetCalculator();
})();
