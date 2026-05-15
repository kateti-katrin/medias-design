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

export function mountBudgetCalculator() {
  const form = document.getElementById("budget-form");
  const resultBox = document.getElementById("budget-result");
  const output = document.getElementById("budget-output");
  const copyBtn = document.getElementById("budget-copy");
  if (!form || !resultBox || !output || !copyBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const raw = Object.fromEntries(new FormData(form).entries());
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    output.textContent = "Считаем…";
    resultBox.hidden = false;

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": csrfToken(),
        },
        body: JSON.stringify({
          quote: {
            type: raw.type,
            pages: raw.pages,
            brandbook: form.elements.brandbook.checked,
            copywriting: form.elements.copywriting.checked,
            analytics: form.elements.analytics.checked,
            urgency: raw.urgency,
          },
          contact: {
            contact_email: raw.contact_email || "",
            contact_name: raw.contact_name || "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      output.textContent = data.text;
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      output.textContent = "Не удалось получить расчёт. Попробуйте ещё раз позже.";
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
