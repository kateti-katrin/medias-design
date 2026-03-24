function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const area = document.createElement("textarea");
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

const BASE_BY_TYPE = {
  landing: { label: "Лендинг", min: 45_000, max: 80_000, weeks: 2 },
  corporate: { label: "Корпоративный сайт", min: 90_000, max: 170_000, weeks: 4 },
  shop: { label: "Интернет-магазин", min: 130_000, max: 260_000, weeks: 6 },
  presentation: { label: "Презентация", min: 30_000, max: 70_000, weeks: 2 },
};

function money(value) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function calculateBudget(data) {
  const project = BASE_BY_TYPE[data.type] || BASE_BY_TYPE.landing;
  const pages = Math.max(1, Number(data.pages || 1));

  let min = project.min;
  let max = project.max;
  let weeks = project.weeks;

  // Базовое масштабирование по объему страниц/экранов
  const pagesFactor = 1 + (pages - 1) * 0.12;
  min *= pagesFactor;
  max *= pagesFactor;

  const additions = [];

  if (data.brandbook) {
    min += 25_000;
    max += 55_000;
    weeks += 1;
    additions.push("Фирменный стиль: +25 000 — 55 000 ₽");
  }

  if (data.copywriting) {
    min += 12_000;
    max += 28_000;
    additions.push("Тексты и редактура: +12 000 — 28 000 ₽");
  }

  if (data.analytics) {
    min += 15_000;
    max += 35_000;
    additions.push("Аналитика и структура: +15 000 — 35 000 ₽");
  }

  if (data.urgency === "fast") {
    min *= 1.18;
    max *= 1.22;
    weeks = Math.max(1, weeks - 1);
    additions.push("Срочность x1.2");
  }

  if (data.urgency === "rush") {
    min *= 1.35;
    max *= 1.45;
    weeks = Math.max(1, weeks - 2);
    additions.push("Очень срочно x1.4");
  }

  return {
    projectLabel: project.label,
    pages,
    min,
    max,
    weeks,
    additions,
  };
}

function budgetText(data, result) {
  return [
    "ПРЕДВАРИТЕЛЬНЫЙ РАСЧЕТ БЮДЖЕТА",
    "",
    `Тип проекта: ${result.projectLabel}`,
    `Объем: ${result.pages} экран(ов)/страниц`,
    `Срок: около ${result.weeks} нед.`,
    "",
    `Бюджет: ${money(result.min)} — ${money(result.max)}`,
    "",
    "Что учтено:",
    `- Базовая стоимость для типа проекта`,
    `- Масштаб по объему страниц/экранов`,
    ...(result.additions.length ? result.additions.map((item) => `- ${item}`) : ["- Без дополнительных опций"]),
    "",
    "Комментарий:",
    "Точная смета формируется после брифа и согласования состава работ.",
  ].join("\n");
}

export function mountBudgetCalculator() {
  const form = document.getElementById("budget-form");
  const resultBox = document.getElementById("budget-result");
  const output = document.getElementById("budget-output");
  const copyBtn = document.getElementById("budget-copy");
  if (!form || !resultBox || !output || !copyBtn) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(form).entries());
    const data = {
      ...raw,
      brandbook: form.elements.brandbook.checked,
      copywriting: form.elements.copywriting.checked,
      analytics: form.elements.analytics.checked,
    };

    const result = calculateBudget(data);
    output.textContent = budgetText(data, result);
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  copyBtn.addEventListener("click", async () => {
    const text = output.textContent.trim();
    if (!text) return;

    await copyText(text);
    const oldLabel = copyBtn.textContent;
    copyBtn.textContent = "Скопировано";
    setTimeout(() => {
      copyBtn.textContent = oldLabel;
    }, 1400);
  });
}
