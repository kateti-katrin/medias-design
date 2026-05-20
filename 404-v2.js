(function () {
  // ── Сценарий (32 строки, влезает в ~820px viewport) ─────────
  var lines = [
    ":/ SMYSL.SYS_404_HANDLER",
    "",
    "[ STATUS  ] PAGE NOT FOUND",
    "[ ERROR   ] 1401 AUTOCODER // PAGE RETRIEVAL FAILURE",
    "[ LOC     ] 004: ATTEMPTED TO LOAD [/404.PAGE]",
    "",
    "> SYSTEM TRACE:",
    "0001 LOAD /HOME",
    "0002 RUN  /ARTICLES",
    "0003 RUN  /SERVICES",
    "0004 EXIT",
    "",
    "> IF LOST == TRUE THEN",
    "> PRINT \"В СМЫСЛЕ ВСЕГДА ОСТАЁТСЯ СМЫСЛ.\"",
    "",
    "[ EXECUTION HALTED ]",
    "[ MEMORY ADDRESS NOT ALLOCATED ]",
    "[ REDIRECT PATH UNDEFINED ]",
    "",
    "> RUNNING SELF-DIAGNOSIS...",
    "0001 — DATA STREAM EMPTY",
    "0002 — CACHE INDEX OUT OF RANGE",
    "0003 — ARTIFACT DETECTED",
    "",
    "> ERROR 404XAF: RESOURCE NOT FOUND",
    "",
    "> LIKELY REASONS:",
    "  — PAGE DELETED",
    "  — PATH CORRUPTED",
    "  — НЕ ПОНЯЛИ ДРУГ ДРУГА С ДИЗАЙНЕРОМ",
    "",
    "> \"ЭТО НЕ ОШИБКА,\" — СКАЗАЛА СИСТЕМА.",
    "> \"ЭТО АРТЕФАКТ.\""
  ];

  var GLITCH_CHARS = ["▓","░","▒","█","▌","▐","╳","╱","╲","Á","Ω","Σ","Δ","Φ","Ø","§","¤","¥","#","%","&","◢","◣","◤","◥"];

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

  // ── Эффекты ─────────────────────────────────────────────────
  async function flash(ms) {
    body.classList.add("t404--flash");
    await sleep(ms || 60);
    body.classList.remove("t404--flash");
  }
  async function heavy(ms) {
    body.classList.add("t404--heavy");
    await sleep(ms || 150);
    body.classList.remove("t404--heavy");
  }
  async function rgbShift(ms) {
    body.classList.add("t404--rgb");
    await sleep(ms || 120);
    body.classList.remove("t404--rgb");
  }
  async function blackout() {
    body.classList.add("t404--blackout");
    await sleep(900);
  }
  function reveal() {
    body.classList.add("t404--reveal");
    actions.classList.add("t404-actions--visible");
  }

  // ── Печать символа (иногда с подменой) ──────────────────────
  async function typeChar(ch, opts) {
    opts = opts || {};
    var glitchChance = opts.glitchChance || 0;
    var headerMode = !!opts.headerMode;

    if (!skipped && ch !== " " && ch !== "\n" && Math.random() < glitchChance) {
      output.textContent += pickGlitch();
      await sleep(rand(20, 50));
      output.textContent = output.textContent.slice(0, -1);
    }

    output.textContent += ch;
    if (skipped) return;

    var delay;
    if (ch === " ") delay = rand(1, 4);
    else if (headerMode) delay = rand(6, 13);
    else delay = rand(2, 6);
    await sleep(delay);
  }

  async function typeLine(line, opts) {
    var isHeader =
      line.indexOf("[ ") === 0 ||
      line.indexOf(":/") === 0;

    for (var i = 0; i < line.length; i++) {
      await typeChar(line[i], {
        glitchChance: opts && opts.glitchChance || 0,
        headerMode: isHeader
      });
    }
    output.textContent += "\n";

    if (skipped) return;
    if (line === "") await sleep(50);
    else if (line.indexOf("> \"") === 0) await sleep(100);
    else if (line.indexOf("[ ") === 0) await sleep(40);
    else if (line.indexOf(":/") === 0) await sleep(110);
    else await sleep(22);
  }

  // ── Случайные эффекты во время печати ───────────────────────
  function startAmbientGlitches() {
    flareTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.55) flash(rand(40, 90));
    }, 3200);

    tearTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.55) heavy(rand(110, 220));
    }, 1900);

    glitchTimer = setInterval(function () {
      if (skipped || !running) return;
      if (Math.random() < 0.5) rgbShift(rand(60, 130));
    }, 1400);
  }

  function stopAmbientGlitches() {
    clearInterval(flareTimer);
    clearInterval(tearTimer);
    clearInterval(glitchTimer);
  }

  // ── Главный цикл ────────────────────────────────────────────
  async function run() {
    if (running) return;
    running = true;
    skipped = false;

    output.textContent = "";
    actions.classList.remove("t404-actions--visible");
    body.classList.remove("t404--blackout", "t404--reveal", "t404--heavy", "t404--flash", "t404--rgb");

    startAmbientGlitches();

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var progress = i / lines.length;
      var glitchChance = 0.02 + progress * 0.09;

      await typeLine(line, { glitchChance: glitchChance });

      if (line.indexOf("ARTIFACT DETECTED") !== -1) {
        await flash(80);
        await heavy(280);
      }
      if (line.indexOf("ERROR 404XAF") !== -1) {
        await rgbShift(140);
        await flash(50);
      }
      if (line.indexOf("ЭТО АРТЕФАКТ") !== -1) {
        await heavy(140);
      }
    }

    stopAmbientGlitches();

    if (skipped) {
      await sleep(120);
    } else {
      // Финальное крещендо — короче и резче
      await sleep(250);
      await heavy(400);
      await flash(80);
      await heavy(250);
      await flash(120);
    }

    await blackout();
    reveal();

    running = false;
  }

  // ── Скип и горячие клавиши ──────────────────────────────────
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

  run();
})();
