(function () {
  // Глазик: показать/скрыть пароль
  var toggle = document.getElementById("login-password-toggle");
  var input = document.getElementById("login-password");
  if (toggle && input) {
    var iconShow = toggle.querySelector(".auth-password__icon--show");
    var iconHide = toggle.querySelector(".auth-password__icon--hide");

    toggle.addEventListener("click", function () {
      var isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(isHidden));
      toggle.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль");
      if (iconShow) iconShow.hidden = isHidden;
      if (iconHide) iconHide.hidden = !isHidden;
    });
  }

  // Форма — заглушка (реальная авторизация подключится позже, на бэкенде Rails)
  var form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Это демонстрация. Реальный вход подключим, когда Rails будет на сервере.");
    });
  }

  // Соцкнопки — пока тоже заглушка
  var socials = document.querySelectorAll(".auth-social");
  socials.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var provider = btn.getAttribute("data-provider") || "соцсеть";
      alert("Вход через " + provider + " подключим вместе с Rails. Скоро.");
    });
  });
})();
