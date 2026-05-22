// Sticky-nav: при скролле страницы вниз навигация «прилипает» к верху экрана.
// Когда возвращаемся наверх — отлипает.
//
// Важно: site-header создаёт stacking context (position:relative + z-index),
// и fixed-ребёнок внутри него не может всплыть выше братьев site-header
// (карточек статей и т.п.). Поэтому при pinned мы ПЕРЕМЕЩАЕМ nav в <body>,
// а при возврате — обратно в свой родительский контейнер.

let stickyOffset = null;
let originalParent = null;
let originalNextSibling = null;
let isMoved = false;

function recalcOffset(nav) {
  if (!nav || isMoved) return;
  const wasPinned = nav.classList.contains("site-nav--pinned");
  if (wasPinned) nav.classList.remove("site-nav--pinned");
  stickyOffset = nav.getBoundingClientRect().top + window.scrollY;
  if (wasPinned) nav.classList.add("site-nav--pinned");
}

function moveToBody(nav) {
  if (isMoved) return;
  originalParent = nav.parentNode;
  originalNextSibling = nav.nextSibling;
  document.body.appendChild(nav);
  isMoved = true;
}

function moveBack(nav) {
  if (!isMoved || !originalParent) return;
  if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
    originalParent.insertBefore(nav, originalNextSibling);
  } else {
    originalParent.appendChild(nav);
  }
  isMoved = false;
}

function update(nav) {
  if (!nav || stickyOffset === null) return;
  const triggerY = stickyOffset - 24;
  const shouldPin = window.scrollY > triggerY;

  if (shouldPin) {
    moveToBody(nav);
    nav.classList.add("site-nav--pinned");
  } else {
    nav.classList.remove("site-nav--pinned");
    moveBack(nav);
  }
}

export function mountStickyNav() {
  const nav = document.querySelector("[data-sticky-nav]");
  if (!nav) return;

  recalcOffset(nav);
  update(nav);

  window.addEventListener("scroll", () => update(nav), { passive: true });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isMoved) {
        nav.classList.remove("site-nav--pinned");
        moveBack(nav);
      }
      recalcOffset(nav);
      update(nav);
    }, 120);
  });
}
