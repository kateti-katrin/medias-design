// Типограф: убирает «висящие» короткие предлоги/союзы (1-2 буквы),
// клея их к следующему слову неразрывным пробелом ( ).
// Запускается автоматически при загрузке страницы и обрабатывает
// текстовые узлы внутри указанных селекторов.
//
// Правило: если короткое слово (≤2 букв) стоит в начале строки или
// после пробела/знака препинания и за ним идёт пробел и ещё слово —
// заменяем этот пробел на NBSP. Так предлог «прилипает» к своему слову
// и не остаётся висеть на конце строки.

(function () {
  // Селекторы блоков, где работаем (избегаем меню, форм, скриптов)
  var SELECTORS = [
    "p", "h1", "h2", "h3", "h4", "h5",
    "li", ".article-card__title", ".land-article__title",
    ".article-page__title", ".art-title", ".art-body",
    ".hero-content__title", ".not-found__lead", ".not-found__title"
  ];

  // Регекс: граница (начало текста или пробел/знак) + 1-2 буквы + пробел
  // Берём кириллицу и латиницу, цифры исключаем.
  var SHORT_WORD = /(^|[\s(«„"'\-—–])([а-яёА-ЯЁa-zA-Z]{1,2})\s+/g;
  var NBSP = " ";

  function typograf(text) {
    // Прогоняем дважды на случай вложенных коротких слов («в и т.д.»)
    for (var i = 0; i < 2; i++) {
      text = text.replace(SHORT_WORD, "$1$2" + NBSP);
    }
    return text;
  }

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var newText = typograf(node.nodeValue);
      if (newText !== node.nodeValue) node.nodeValue = newText;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    var tag = node.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE" || tag === "PRE") return;
    for (var i = 0; i < node.childNodes.length; i++) {
      processNode(node.childNodes[i]);
    }
  }

  function run() {
    SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) processNode(els[i]);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
