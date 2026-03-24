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
  const brandNote =
    data.brand === "Есть брендбук и готовые материалы"
      ? "Фирменный стиль готов — брендбук и материалы предоставим."
      : data.brand === "Есть логотип, но нет системы"
      ? "Есть логотип, но единого стиля нет. Нужно выстроить систему."
      : "Фирменного стиля нет. Потребуется разработка с нуля.";

  const notesLine = data.notes?.trim()
    ? `\nДополнительно\n${data.notes.trim()}`
    : "";

  return `ТЕХНИЧЕСКОЕ ЗАДАНИЕ НА ДИЗАЙН

Проект: ${data.projectType}
Срок запуска: ${data.deadline}

Задача
${data.goal.trim()}

Целевая аудитория
${data.audience.trim()}

Ключевое действие пользователя
${data.cta}

Фирменный стиль
${brandNote}

Состав страницы / экранов
${data.blocks.trim()}${notesLine}

Ожидаемый результат: готовые макеты для передачи в разработку, соответствующие цели проекта и аудитории.`;
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
    output.textContent = buildBrief(data);
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
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
