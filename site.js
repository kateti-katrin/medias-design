(function () {
  var path = window.location.pathname;
  var last = path.split("/").pop();

  if (path !== "/" && !path.endsWith("/") && last.indexOf(".") === -1) {
    window.location.replace(window.location.origin + path + "/" + window.location.search + window.location.hash);
    return;
  }

  function mountArticlesFilter() {
    var buttons = document.querySelectorAll(".reading-filters__button");
    var cards = document.querySelectorAll(".reading-grid .article-card");
    if (!buttons.length || !cards.length) return;

    function applyFilter(tag) {
      cards.forEach(function (card) {
        var cardTag = card.getAttribute("data-tag");
        var show = tag === "all" || cardTag === tag;
        card.hidden = !show;
        card.style.display = show ? "" : "none";
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var current = button.getAttribute("data-filter");

        buttons.forEach(function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        applyFilter(current);
      });
    });

    applyFilter("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountArticlesFilter);
  } else {
    mountArticlesFilter();
  }
})();
