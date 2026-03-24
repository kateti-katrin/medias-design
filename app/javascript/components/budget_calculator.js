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

const BASE = {
  freelancer: {
    landing:      { label: "Лендинг",             min: 30_000,  max: 55_000,  weeks: 2 },
    corporate:    { label: "Корпоративный сайт",  min: 60_000,  max: 110_000, weeks: 4 },
    shop:         { label: "Интернет-магазин",     min: 80_000,  max: 150_000, weeks: 5 },
    presentation: { label: "Презентация",          min: 20_000,  max: 45_000,  weeks: 2 },
  },
  agency: {
    landing:      { label: "Лендинг",             min: 65_000,  max: 130_000, weeks: 3 },
    corporate:    { label: "Корпоративный сайт",  min: 140_000, max: 260_000, weeks: 6 },
    shop:         { label: "Интернет-магазин",     min: 200_000, max: 390_000, weeks: 8 },
    presentation: { label: "Презентация",          min: 50_000,  max: 110_000, weeks: 3 },
  },
};

function money(value) {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function calcFor(type, pages, data, tier) {
  const project = BASE[tier][type] || BASE[tier].landing;
  let min = project.min;
  let max = project.max;
  let weeks = project.weeks;

  const pagesFactor = 1 + (pages - 1) * 0.12;
  min *= pagesFactor;
  max *= pagesFactor;

  const additions = [];

  if (data.brandbook) {
    const [bbMin, bbMax] = tier === "freelancer" ? [15_000, 30_000] : [35_000, 70_000];
    min += bbMin; max += bbMax; weeks += 1;
    additions.push(`Фирменный стиль: +${money(bbMin)} — ${money(bbMax)}`);
  }

  if (data.copywriting) {
    const [cpMin, cpMax] = tier === "freelancer" ? [8_000, 18_000] : [18_000, 38_000];
    min += cpMin; max += cpMax;
    additions.push(`Тексты: +${money(cpMin)} — ${money(cpMax)}`);
  }

  if (data.analytics) {
    const [anMin, anMax] = tier === "freelancer" ? [10_000, 20_000] : [22_000, 45_000];
    min += anMin; max += anMax;
    additions.push(`Аналитика: +${money(anMin)} — ${money(anMax)}`);
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

  return { min, max, weeks, additions, label: project.label };
}

function addsList(items) {
  return items.length
    ? items.map((a) => `  · ${a}`).join("\n")
    : "  · Без дополнительных опций";
}

function budgetText(data, fl, ag) {
  return [
    "ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ БЮДЖЕТА",
    "",
    `Проект: ${fl.label}, ${data.pages} экр./стр.`,
    "",
    "── Фрилансер ──────────────────────",
    `Бюджет: ${money(fl.min)} — ${money(fl.max)}`,
    `Срок:   ~${fl.weeks} нед.`,
    "Что учтено:",
    addsList(fl.additions),
    "",
    "── Агентство ──────────────────────",
    `Бюджет: ${money(ag.min)} — ${money(ag.max)}`,
    `Срок:   ~${ag.weeks} нед.`,
    "Что учтено:",
    addsList(ag.additions),
    "",
    "Это ориентир. Финальная смета — после брифа и согласования состава работ.",
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
      pages: Math.max(1, Number(raw.pages || 1)),
      brandbook: form.elements.brandbook.checked,
      copywriting: form.elements.copywriting.checked,
      analytics: form.elements.analytics.checked,
    };

    const fl = calcFor(data.type, data.pages, data, "freelancer");
    const ag = calcFor(data.type, data.pages, data, "agency");

    output.textContent = budgetText(data, fl, ag);
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  copyBtn.addEventListener("click", async () => {
    const text = output.textContent.trim();
    if (!text) return;

    await copyText(text);
    const oldLabel = copyBtn.textContent;
    copyBtn.textContent = "Скопировано";
    setTimeout(() => { copyBtn.textContent = oldLabel; }, 1400);
  });
}
