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

function csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute("content") : "";
}

export function mountBriefQuiz() {
  const form = document.getElementById("brief-quiz-form");
  const result = document.getElementById("brief-result");
  const output = document.getElementById("brief-output");
  const copyBtn = document.getElementById("brief-copy");
  if (!form || !result || !output || !copyBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    output.textContent = "Готовим ТЗ…";
    result.hidden = false;

    try {
      const response = await fetch("/api/briefs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": csrfToken(),
        },
        body: JSON.stringify({
          brief: {
            projectType: data.projectType,
            goal: data.goal,
            audience: data.audience,
            cta: data.cta,
            brand: data.brand,
            blocks: data.blocks,
            deadline: data.deadline,
            notes: data.notes,
          },
          contact: {
            contact_email: data.contact_email || "",
            contact_name: data.contact_name || "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      output.textContent = json.text;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      output.textContent = "Не удалось получить ТЗ. Попробуйте позже.";
      console.error(err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
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
