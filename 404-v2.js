(function () {
  // ── Сценарий ────────────────────────────────────────────────
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

  var GLITCH_CHARS = ["▓","░","▒","█","▌","▐","╳","╱","╲","Á","Ω","Σ","Δ","Φ","Ø","§","¤","¥","#","%","&","░","▓","◢","◣","◤","◥"];

  var output = document.getElementById("t404-out");
  var actions = document.getElementById("t404-actions");
  var replayBtn = document.getElementById("t404-replay");
  var body = document.body;

  var skipped = false;
  var running = false;
  var flareTimer = null;
  var tearTimer = null;
  var glitchTimer = null;

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, skipped ? 0 : ms); });
  }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pickGlitch() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

  // ── Эффекты (включаются добавлением класса на body) ─────────
  async function flash(ms) {
    body.classList.add("t404--flash");
    await sleep(ms || 80);
    body.classList.remove("t404--flash");
  }
  async function heavy(ms) {
    body.classList.add("t404--heavy");
    await sleep(ms || 200);
    body.classList.remove("t404--heavy");
  }
  async function rgbShift(ms) {
    body.classList.add("t404--rgb");
    await sleep(ms || 150);
    body.classList.remove("t404--rgb");
  }
  async function blackout() {
    body.classList.add("t404--blackout");
    await sleep(1400);
  }
  function reveal() {
    body.classList.add("t404--reveal");
    actions.classList.add("t404-actions--visible");
  }

  // ── Печать одного символа (иногда с «глюком») ────────────────
  async function typeChar(ch, opts) {
    opts = opts || {};
    var glitchChance = opts.glitchChance || 0;
    var headerMode = !!opts.headerMode;

    if (!skipped && ch !== " " && ch !== "\n" && Math.random() < glitchChance) {
      // печатаем «не тот» символ, потом стираем и ставим правильный
      output.textContent += pickGlitch();
      await sleep(rand(40, 110));
      output.textContent = output.textContent.slice(0, -1);
    }

    output.textContent += ch;
    if (skipped) return;

    var delay;
    if (ch === " ") delay = rand(3, 9);
    else if (headerMode) delay = rand(14, 28);
    else delay = rand(5, 12);
    await sleep(delay);
  }

  async function typeLine(line, opts) {
    var isHeader =
      line.indexOf("[ ") === 0 ||
      line.indexOf(":/") === 0 ||
      line.indexOf("> ИНИЦИАЛИЗАЦИЯ") === 0;

    for (var i = 0; i < line.length; i++) {
      await typeChar(line[i], {
        glitchChance: opts && opts.glitchChance || 0,
        headerMode: isHeader
      });
    }
    output.textContent += "\n";

    if (skipped) return;
    if (line === "") await sleep(120);
    else if (line.indexOf("> \"") === 0) await sleep(180);
    else if (line.indexOf("[ ") === 0) await sleep(80);
    else if (line.indexOf(":/") === 0) await sleep(220);
    else await sleep(50);
  }

  // ── Случайные глитчи во время печати ─────────────────────────
  function startAmbientGlitches() {
    flareTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.6) flash(rand(40, 90));
    }, 4200);

    tearTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.55) heavy(rand(120, 260));
    }, 2400);

    glitchTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.5) rgbShift(rand(70, 150));
    }, 1800);
  }

  function stopAmbientGlitches() {
    clearInterval(flareTimer);
    clearInterval(tearTimer);
    clearInterval(glitchTimer);
  }

  // ── Основной цикл ────────────────────────────────────────────
  async function run() {
    if (running) return;
    running = true;
    skipped = false;

    // Сброс состояния
    output.textContent = "";
    actions.classList.remove("t404-actions--visible");
    body.classList.remove("t404--blackout", "t404--reveal", "t404--heavy", "t404--flash", "t404--rgb");

    startAmbientGlitches();

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      // Чем дальше — тем выше шанс глюка символа
      var progress = i / lines.length;
      var glitchChance = 0.02 + progress * 0.08;

      await typeLine(line, { glitchChance: glitchChance });

      // Драматические события на ключевых строках
      if (line.indexOf("ARTIFACT DETECTED") !== -1) {
        await flash(120);
        await heavy(450);
      }
      if (line.indexOf("ERROR 404XAF") !== -1) {
        await rgbShift(220);
        await flash(60);
      }
      if (line.indexOf("ЭТО АРТЕФАКТ") !== -1) {
        await heavy(180);
      }
    }

    stopAmbientGlitches();

    if (skipped) {
      // быстрый финал, если пользователь нажал скип
      await sleep(200);
    } else {
      // Драматическое крещендо
      await sleep(500);
      await heavy(700);
      await flash(120);
      await heavy(400);
      await flash(180);
    }

    await blackout();
    reveal();

    running = false;
  }

  // ── Скип анимации и горячие клавиши ──────────────────────────
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

  if (replayBtn) replayBtn.addEventListener("click", run);

  // Старт
  run();
})();
