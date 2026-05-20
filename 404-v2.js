(function () {
  // Сценарий: смесь техлога и брендового голоса
  var lines = [
    ":/ SMYSL.SYS_404_HANDLER",
    "> ИНИЦИАЛИЗАЦИЯ...",
    "",
    "[ STATUS  ] PAGE NOT FOUND",
    "[ ERROR   ] 1401 AUTOCODER // PAGE RETRIEVAL FAILURE",
    "[ LOC     ] 004: ATTEMPTED TO LOAD RESOURCE [/404.PAGE]",
    "[ ACTION  ] РЕДАКЦИЯ ПЕРЕЗАГРУЖАЕТ СИСТЕМУ...",
    "",
    "> SYSTEM TRACE:",
    "0001 LOAD /HOME",
    "0002 RUN  /ARTICLES",
    "0003 RUN  /SERVICES/BRIEF",
    "0004 RUN  /SERVICES/CALCULATOR",
    "0005 EXIT",
    "",
    "> IF LOST == TRUE THEN",
    "> PRINT \"В СМЫСЛЕ ВСЕГДА ОСТАЁТСЯ СМЫСЛ.\"",
    "",
    "[ EXECUTION HALTED ]",
    "[ MEMORY ADDRESS NOT ALLOCATED ]",
    "[ REDIRECT PATH UNDEFINED ]",
    "[ INITIATE MANUAL REBOOT (/HOME) ]",
    "",
    "> RUNNING SELF-DIAGNOSIS...",
    "0001 — ALLOCATE MEMORY BLOCK [PAGE.DATA]",
    "0002 — DATA STREAM EMPTY",
    "0003 — RETRIEVE FROM CACHE... TIMEOUT",
    "0004 — CACHE INDEX OUT OF RANGE",
    "0005 — ARTIFACT DETECTED",
    "",
    "> ERROR 404XAF: RESOURCE NOT FOUND",
    "> CAUSE: UNKNOWN",
    "",
    "> LIKELY REASONS:",
    "  — PAGE DELETED",
    "  — PATH CORRUPTED",
    "  — НЕ ПОНЯЛИ ДРУГ ДРУГА С ДИЗАЙНЕРОМ",
    "",
    "> RECOVERY STEPS:",
    "  > TRY AGAIN",
    "  > GO HOME",
    "",
    "> \"ЭТО НЕ ОШИБКА,\" — СКАЗАЛА СИСТЕМА.",
    "> \"ЭТО АРТЕФАКТ.\"",
    "",
    "[ READY TO REBOOT ]"
  ];

  var output = document.getElementById("t404-out");
  var actions = document.getElementById("t404-actions");
  var replayBtn = document.getElementById("t404-replay");

  var skipped = false;
  var running = false;
  var tickAudio = null; // звуковой эффект — пока выключен

  function sleep(ms) {
    return new Promise(function (resolve) {
      if (skipped) return resolve();
      setTimeout(resolve, ms);
    });
  }

  // Случайная задержка между символами — даёт «живое» ощущение печати
  function charDelay(ch, isHeader) {
    if (skipped) return 0;
    if (ch === " ") return 4 + Math.random() * 6;
    if (isHeader) return 16 + Math.random() * 14;
    return 6 + Math.random() * 10;
  }

  // Пауза после строки — длиннее после заголовков и пустых строк
  function lineDelay(line) {
    if (skipped) return 0;
    if (line === "") return 110;
    if (line.indexOf("[ ") === 0) return 80;
    if (line.indexOf("> \"") === 0) return 160; // «киношная» реплика
    if (line.indexOf(":/") === 0) return 200;
    return 45;
  }

  async function typeLine(line) {
    var isHeader =
      line.indexOf("[ ") === 0 ||
      line.indexOf(":/") === 0 ||
      line.indexOf("> ИНИЦИАЛИЗАЦИЯ") === 0;

    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      output.textContent += ch;
      await sleep(charDelay(ch, isHeader));
    }
    output.textContent += "\n";
    await sleep(lineDelay(line));
  }

  async function run() {
    if (running) return;
    running = true;
    skipped = false;
    output.textContent = "";
    actions.classList.remove("t404-actions--visible");

    for (var i = 0; i < lines.length; i++) {
      await typeLine(lines[i]);
    }

    actions.classList.add("t404-actions--visible");
    running = false;
  }

  // Скип анимации — клик или любая клавиша
  function skipAnimation() {
    if (running) skipped = true;
  }
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest(".t404-actions")) return;
    skipAnimation();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      window.location.href = "./index.html";
      return;
    }
    if (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К") {
      run();
      return;
    }
    skipAnimation();
  });

  // Replay
  if (replayBtn) {
    replayBtn.addEventListener("click", function () {
      run();
    });
  }

  // Запуск
  run();
})();
