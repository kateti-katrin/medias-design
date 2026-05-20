(function () {
  var ctaMessages = {
    hero: "Здесь будет оплата. В демо — заглушка. На бэкенде подключим ЮKassa / Stripe.",
    month: "Подписка «Месяц» — 390 ₽. Здесь откроется форма оплаты.",
    year: "Подписка «Год» — 2 990 ₽. Самый выгодный вариант.",
    mentor: "Подписка «С куратором» — 1 490 ₽/мес. С тобой свяжется наш человек и подберёт куратора.",
    final: "Здесь будет оплата. В демо — заглушка."
  };

  document.querySelectorAll("[data-cta]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cta = btn.getAttribute("data-cta");
      alert(ctaMessages[cta] || "Это демонстрация.");
    });
  });
})();
