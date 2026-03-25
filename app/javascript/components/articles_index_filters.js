export function mountArticlesFilters() {
  const filters = Array.from(document.querySelectorAll(".articles-pg-filter"));
  const cards = Array.from(document.querySelectorAll(".articles [data-tag]"));
  if (filters.length === 0 || cards.length === 0) return;

  const applyFilter = (tag) => {
    cards.forEach((card) => {
      card.hidden = !(tag === "all" || card.dataset.tag === tag);
    });
  };

  filters.forEach((button) => {
    if (button.dataset.bound === "1") return;

    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      const tag = button.dataset.filter;
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilter(tag);
    });
  });
}
