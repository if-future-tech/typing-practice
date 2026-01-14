/* ============================================================
   タイピングアプリ：完全リファクタリング版
   - 出題管理
   - 入力処理
   - スコア管理
   - タイマー
   - サウンド
   - UIイベント
============================================================ */

/* ------------------------------
   状態管理
------------------------------ */
let selectedCategory = "basic";
let currentWord = "";
let inputValue = "";
let currentIndex = 0;

let score = { correct: 0, mistakes: 0 };
let startTime = null;
let elapsedTime = 0;
let isStarted = false;
let timerInterval = null;

/* ------------------------------
   DOM 参照
------------------------------ */
const inputEl = document.getElementById("typingInput");
const categoryEl = document.getElementById("categorySelect");
const questionArea = document.getElementById("questionArea");
const startBtn = document.getElementById("startBtn");

/* ------------------------------
   初期化
------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  loadWords(() => {
    renderKeyboard();
    populateCategories();
    loadRandomWord();
    renderScoreBoard(score.correct, score.mistakes, elapsedTime);
  });
});

/* ============================================================
   カテゴリ選択
============================================================ */
function populateCategories() {
  if (!window.wordData || !wordData.categories) return;

  wordData.categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categoryEl.appendChild(opt);
  });
  categoryEl.value = selectedCategory;
}

/* ============================================================
   出題処理
============================================================ */
function loadRandomWord() {
  if (!window.wordData) return;

  const catId = categoryEl.value; 
  const cat = wordData.categories.find(c => c.id === catId);
  if (!cat) return;

  const words = cat.words;
  currentWord = words[Math.floor(Math.random() * words.length)];

  inputValue = "";
  currentIndex = 0;

  inputEl.value = "";   // ← 入力欄クリア
  inputEl.focus();

  renderQuestion();
  updateExpectedKey();
}

/* 出題表示 */
function renderQuestion() {
  questionArea.innerHTML = currentWord
    .split("")
    .map((char, idx) => {
      const displayChar = char === " " ? "␣" : char;

      if (idx < inputValue.length) return `<span class="correct">${displayChar}</span>`;
      if (idx === currentIndex) return `<span class="current">${displayChar}</span>`;
      return `<span class="pending">${displayChar}</span>`;
    })
    .join("");
}

/* 次のキーのハイライト */
function updateExpectedKey() {
  const expected = currentWord[currentIndex] || "";
  if (typeof markExpectedKey === "function") markExpectedKey(expected);
}

/* ============================================================
   入力処理
============================================================ */
inputEl.addEventListener("input", e => {
  if (!isStarted) startTyping();

  const newValue = e.target.value;
  if (newValue.length > currentWord.length) return;

  const lastChar = newValue[newValue.length - 1];
  const expected = currentWord[newValue.length - 1];

  // 追加文字の正誤判定
  if (newValue.length > inputValue.length) {
    if (lastChar !== expected) {
      score.mistakes++;
      playErrorSound();
      e.target.value = inputValue;
      return;
    } else {
      score.correct++;
      inputValue = newValue;
      currentIndex = newValue.length;
    }
  } else {
    inputValue = newValue;
    currentIndex = newValue.length;
  }

  renderQuestion();
  updateExpectedKey();
  renderScoreBoard(score.correct, score.mistakes, elapsedTime);

  // 完了判定
  if (newValue === currentWord) {
    setTimeout(loadRandomWord, 500);
  }
});

/* ============================================================
   スタート処理
============================================================ */
function startTyping() {
  isStarted = true;
  startTime = Date.now();
  elapsedTime = 0;

  score = { correct: 0, mistakes: 0 };
  renderScoreBoard(score.correct, score.mistakes, elapsedTime);

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    renderScoreBoard(score.correct, score.mistakes, elapsedTime);
  }, 1000);
}

startBtn.addEventListener("click", () => {
  isStarted = false;
  inputEl.value = "";
  inputValue = "";
  currentIndex = 0;
  score = { correct: 0, mistakes: 0 };
  elapsedTime = 0;

  startTyping();
  loadRandomWord();
  inputEl.focus();
});

/* ============================================================
   カテゴリ変更
============================================================ */
categoryEl.addEventListener("change", e => {
  selectedCategory = e.target.value;

  isStarted = false;
  inputEl.value = "";
  inputValue = "";
  currentIndex = 0;
  score = { correct: 0, mistakes: 0 };
  elapsedTime = 0;

  loadRandomWord();
  renderScoreBoard(score.correct, score.mistakes, elapsedTime);
});

/* ============================================================
   キーボード押下
============================================================ */
document.addEventListener("keydown", e => {
  if (typeof highlightKey === "function") highlightKey(e.key);
});
document.addEventListener("keyup", e => {
  if (typeof unhighlightKey === "function") unhighlightKey(e.key);
});

/* ============================================================
   サウンド（効果音 + BGM）
============================================================ */
let isSoundMuted = false;
let isBgmMuted = false;

/* 効果音 */
function playErrorSound() {
  if (isSoundMuted) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 200;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 100);
}

function playTypeSound() {
  if (isSoundMuted) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 600;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 40);
}

function playCorrectSound() {
  if (isSoundMuted) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 900;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 80);
}

/* BGM */
const bgm = new Audio("./assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.4;

/* トグル */
function toggleSound() {
  isSoundMuted = !isSoundMuted;
  document.getElementById("soundIcon").textContent = isSoundMuted ? "🔇" : "🔊";
}

function toggleBGM() {
  isBgmMuted = !isBgmMuted;
  if (isBgmMuted) bgm.pause();
  else bgm.play();
  document.getElementById("bgmIcon").textContent = isBgmMuted ? "🔕" : "🎵";
}

/* ボタン登録 */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("soundToggle")?.addEventListener("click", toggleSound);
  document.getElementById("bgmToggle")?.addEventListener("click", toggleBGM);
});

/* 外部公開 */
window.playErrorSound = playErrorSound;
window.playTypeSound = playTypeSound;
window.playCorrectSound = playCorrectSound;
