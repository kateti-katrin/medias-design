// AJAX-обработчик для виджета реакций и кнопки «в избранное».
// Слушает submit на формах, делает fetch к toggle-эндпойнтам,
// получает JSON с новым состоянием и обновляет DOM без перезагрузки.

function findReactionButton(widget, kind) {
  // button_to внутри form. Сначала ищем form по action, потом button внутри.
  const form = widget.querySelector(`form[action*="/toggle_reaction/${kind}"]`);
  return form ? form.querySelector("button") : null;
}

function updateReactionWidget(widget, reactions) {
  if (!reactions) return;
  reactions.forEach((r) => {
    const btn = findReactionButton(widget, r.kind);
    if (!btn) return;

    const countEl = btn.querySelector(".art-reaction__count");
    if (countEl) countEl.textContent = r.count;

    btn.classList.toggle("is-mine", !!r.mine);
    btn.classList.add("is-pulsing");
    setTimeout(() => btn.classList.remove("is-pulsing"), 420);
  });
}

function updateFavouriteButton(form, isFavourite) {
  const icon = form.querySelector("[data-favourite-icon]");
  const label = form.querySelector("[data-favourite-label]");
  const btn = form.querySelector("button");
  if (icon) icon.textContent = isFavourite ? "★" : "☆";
  if (label) label.textContent = isFavourite ? "в избранном" : "в избранное";
  if (btn) btn.classList.toggle("is-favourite", isFavourite);
}

async function ajaxSubmit(form) {
  const response = await fetch(form.action, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    credentials: "same-origin"
  });

  if (response.status === 401) {
    const data = await response.json().catch(() => ({}));
    if (data.redirect) window.location.href = data.redirect;
    return null;
  }

  if (!response.ok) {
    throw new Error("Server error: " + response.status);
  }

  return response.json();
}

export function mountArticleReactions() {
  // Реакции (5 эмодзи)
  document.querySelectorAll("[data-reactions-widget]").forEach((widget) => {
    widget.querySelectorAll("form.button_to, form").forEach((form) => {
      if (!form.action || !form.action.includes("/toggle_reaction/")) return;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const data = await ajaxSubmit(form);
          if (data && data.reactions) updateReactionWidget(widget, data.reactions);
        } catch (err) {
          console.error("Не удалось обновить реакцию", err);
          form.submit(); // fallback: обычный submit
        }
      });
    });
  });

  // Избранное (★)
  document.querySelectorAll("[data-favourite-form]").forEach((btn) => {
    // button_to создаёт <form> снаружи кнопки — поэтому ищем родительский form
    const form = btn.closest("form") || btn;
    if (!form || form.dataset.favouriteWired === "1") return;
    form.dataset.favouriteWired = "1";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const data = await ajaxSubmit(form);
        if (data && typeof data.favourite === "boolean") {
          updateFavouriteButton(form, data.favourite);
        }
      } catch (err) {
        console.error("Не удалось обновить избранное", err);
        form.submit();
      }
    });
  });
}
