// Типограф для Rails-версии — экспортируется и подключается из application.js.
// Логика идентична статичному typograf.js: короткие предлоги (1-2 буквы)
// «прилипают» к следующему слову через NBSP.

const SELECTORS = [
  "p", "h1", "h2", "h3", "h4", "h5",
  "li", ".article-card__title", ".land-article__title",
  ".article-page__title", ".art-title", ".art-body",
  ".hero-content__title", ".not-found__lead", ".not-found__title"
];

const SHORT_WORD = /(^|[\s(«„"'\-—–])([а-яёА-ЯЁa-zA-Z]{1,2})\s+/g;
const NBSP = " ";

function typograf(text) {
  for (let i = 0; i < 2; i++) {
    text = text.replace(SHORT_WORD, "$1$2" + NBSP);
  }
  return text;
}

function processNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const newText = typograf(node.nodeValue);
    if (newText !== node.nodeValue) node.nodeValue = newText;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const tag = node.tagName;
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE" || tag === "PRE") return;
  for (let i = 0; i < node.childNodes.length; i++) {
    processNode(node.childNodes[i]);
  }
}

export function mountTypograf() {
  SELECTORS.forEach((sel) => {
    const els = document.querySelectorAll(sel);
    els.forEach((el) => processNode(el));
  });
}
