(function () {
  // ── Действия в шапке и карточках (заглушки) ──────────────────
  var actionMessages = {
    edit: "Редактирование профиля подключим, когда Rails будет на сервере.",
    logout: "Выход подключим вместе с Rails.",
    open: "Откроется страница ТЗ. В демо — заглушка.",
    copy: "Содержимое скопировано (в боевой версии — в буфер обмена).",
    delete: "В боевой версии — мягкое удаление с подтверждением.",
    unbookmark: "В боевой версии — звезда снимется, статья пропадёт из закладок.",
    password: "Откроется форма смены пароля.",
    "delete-account": "В боевой версии — двойное подтверждение и прощальный экран."
  };

  document.querySelectorAll("[data-action]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var action = el.getAttribute("data-action");
      var message = actionMessages[action] || "Это демонстрация.";
      // Если это <a> — не блокируем переход (например, «читать», «открыть» в закладках)
      if (el.tagName !== "A") {
        e.preventDefault();
        alert(message);
      }
    });
  });

  // ── Личная заметка: статус «изменено / сохранено» ────────────
  var noteField = document.getElementById("profile-note-field");
  var noteStatus = document.getElementById("profile-note-status");
  var noteForm = document.getElementById("profile-note-form");

  if (noteField && noteStatus && noteForm) {
    var originalText = noteField.value;

    noteField.addEventListener("input", function () {
      if (noteField.value === originalText) {
        noteStatus.textContent = "сохранено";
        noteStatus.removeAttribute("data-dirty");
      } else {
        noteStatus.textContent = "есть несохранённые изменения";
        noteStatus.setAttribute("data-dirty", "true");
      }
    });

    noteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      originalText = noteField.value;
      noteStatus.textContent = "сохранено";
      noteStatus.removeAttribute("data-dirty");
    });
  }
})();
