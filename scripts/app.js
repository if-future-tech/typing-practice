/* ============================================================
   タイピングアプリ：完全リファクタリング版
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
  inputEl.disabled = true; // ← 初期状態で入力禁止

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

  inputEl.value = "";
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
  if (inputEl.disabled) return;   // ← 出題前は無視
  if (!currentWord) return;       // ← currentWord が空なら無視
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
    setTimeout(() => {
      loadRandomWord();
