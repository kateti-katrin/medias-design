// Sticky-nav: при скролле страницы вниз навигация «прилипает» к верху экрана.
// Когда возвращаемся наверх — отлипает.
//
// Использование: на nav-элементе должен быть атрибут data-sticky-nav.
// Класс .site-nav--pinned задаёт фиксированную позицию.

let stickyOffset = null;

function recalcOffset(nav) {
  if (!nav) return;
  // Снимаем класс ВРЕМЕННО, чтобы измерить «родную» позицию nav в hero
  const wasPinned = nav.classList.contains("site-nav--pinned");
  if (wasPinned) nav.classList.remove("site-nav--pinned");
  stickyOffset = nav.getBoundingClientRect().top + window.scrollY;
  if (wasPinned) nav.classList.add("site-nav--pinned");
}

function update(nav) {
  if (!nav || stickyOffset === null) return;
  const triggerY = stickyOffset - 24; // 24px от верха окна
  if (window.scrollY > triggerY) {
    nav.classList.add("site-nav--pinned");
  } else {
    nav.classList.remove("site-nav--pinned");
  }
}

export function mountStickyNav() {
  const nav = document.querySelector("[data-sticky-nav]");
  if (!nav) return;

  recalcOffset(nav);
  update(nav);

  window.addEventListener("scroll", () => update(nav), { passive: true });

  // При ресайзе пересчитываем
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      recalcOffset(nav);
      update(nav);
    }, 120);
  });
}
