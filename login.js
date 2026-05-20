(function () {
  // ── Глазик: показать/скрыть пароль ─────────────────────────────
  var toggle = document.getElementById("login-password-toggle");
  var input = document.getElementById("login-password");

  if (toggle && input) {
    var iconShow = toggle.querySelector(".auth-password__icon--show"); // открытый глаз
    var iconHide = toggle.querySelector(".auth-password__icon--hide"); // перечёркнутый

    // Правило интерфейса:
    //   пароль ВИДЕН  → показываем ПЕРЕЧЁРКНУТЫЙ глаз (предлагаем скрыть)
    //   пароль СКРЫТ  → показываем ОТКРЫТЫЙ глаз     (предлагаем показать)
    function syncIcon(passwordVisible) {
      if (passwordVisible) {
        if (iconShow) iconShow.setAttribute("hidden", "");
        if (iconHide) iconHide.removeAttribute("hidden");
        toggle.setAttribute("aria-label", "Скрыть пароль");
        toggle.setAttribute("aria-pressed", "true");
      } else {
        if (iconShow) iconShow.removeAttribute("hidden");
        if (iconHide) iconHide.setAttribute("hidden", "");
        toggle.setAttribute("aria-label", "Показать пароль");
        toggle.setAttribute("aria-pressed", "false");
      }
    }

    // Начальное состояние: пароль скрыт
    syncIcon(false);

    toggle.addEventListener("click", function () {
      var willBeVisible = input.type === "password"; // до клика скрыт → станет виден
      input.type = willBeVisible ? "text" : "password";
      syncIcon(willBeVisible);
    });
  }

  // ── Форма — заглушка (реальная авторизация подключится с Rails) ──
  var form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Это демонстрация. Реальный вход подключим, когда Rails будет на сервере.");
    });
  }

  // ── Соцкнопки — пока тоже заглушка ───────────────────────────────
  var socials = document.querySelectorAll(".auth-social");
  socials.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var provider = btn.getAttribute("data-provider") || "соцсеть";
      alert("Вход через " + provider + " подключим вместе с Rails. Скоро.");
    });
  });
})();
