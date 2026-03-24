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

function buildBrief(data) {
  return [
    "ТЕХНИЧЕСКОЕ ЗАДАНИЕ НА ДИЗАЙН",
    "",
    `1. Тип проекта: ${data.projectType}`,
    `2. Цель проекта: ${data.goal}`,
    `3. Целевая аудитория: ${data.audience}`,
    `4. Ключевое действие пользователя (CTA): ${data.cta}`,
    `5. Материалы по бренду: ${data.brand}`,
    `6. Обязательные блоки: ${data.blocks}`,
    `7. Желаемый срок запуска: ${data.deadline}`,
    `8. Дополнительные пожелания: ${data.notes || "—"}`,
    "",
    "Ожидаемый результат:",
    "- Визуальное решение, соответствующее цели проекта и аудитории",
    "- Понятная структура контента по указанным блокам",
    "- Подготовка макетов для передачи в разработку",
  ].join("\n");
}

export function mountBriefQuiz() {
  const form = document.getElementById("brief-quiz-form");
  const result = document.getElementById("brief-result");
  const output = document.getElementById("brief-output");
  const copyBtn = document.getElementById("brief-copy");
  if (!form || !result || !output || !copyBtn) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const text = buildBrief(data);
    output.textContent = text;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
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
