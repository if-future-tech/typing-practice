// scripts/app.js

import { wordData, loadWords } from "./words.js";
import { renderKeyboard, highlightKey, unhighlightKey, markExpectedKey } from "./keyboard.js";
import { playErrorSound } from "./sound.js";
import { renderScoreBoard } from "./score.js";

// ------------------------------
// 状態管理（React の useState 相当）
// ------------------------------
let selectedCategory = "basic";
let currentWord = "";
let inputValue = "";
let currentIndex = 0;
let score = { correct: 0, mistakes: 0 };
let startTime = null;
let elapsedTime = 0;
let isStarted = false;
let timerInterval = null;

let soundEnabled = true;
let bgmEnabled = false;
let bgmContext = null;
let bgmOsc = null;

// ------------------------------
// DOM 参照
// ------------------------------
const inputEl = document.getElementById("typingInput");
const categoryEl = document.getElementById("categorySelect");
const questionArea = document.getElementById("questionArea");
const startBtn = document.getElementById("startBtn");
const soundToggle = document.getElementById("soundToggle");
const bgmToggle = document.getElementById("bgmToggle");

// ------------------------------
// 初期化
// ------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  await loadWords();
  populateCategories();
  renderKeyboard();
  loadRandomWord();
  renderScoreBoard(score.correct, score.mistakes, elapsedTime);
});

// ------------------------------
// カテゴリ選択 UI
// ------------------------------
function populateCategories() {
  wordData.categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categoryEl.appendChild(opt);
  });
}

// ------------------------------
// ランダム出題
// ------------------------------
function loadRandomWord() {
  const cat = wordData.categories.find(c => c.id === selectedCategory);
  const words = cat.words;

  currentWord = words[Math.floor(Math.random() * words.length)];
  inputValue = "";
  currentIndex = 0;

  renderQuestion();
  updateExpectedKey();
}

// ------------------------------
// 出題表示（React の JSX 部分を JS に変換）
// ------------------------------
function renderQuestion() {
  questionArea.innerHTML = currentWord
    .split("")
    .map((char, idx) => {
      if (idx < inputValue.length) {
        return `<span class="correct">${char === " " ? "␣" : char}</span>`;
      }
      if (idx === currentIndex) {
        return `<span class="current">${char === " " ? "␣" : char}</span>`;
      }
      return `<span class="pending">${char === " " ? "␣" : char}</span>`;
    })
    .join("");
}

// ------------------------------
// 次のキーのハイライト
// ------------------------------
function updateExpectedKey() {
  const expected = currentWord[currentIndex] || "";
  markExpectedKey(expected);
}

// ------------------------------
// 入力処理（React の handleInputChange）
// ------------------------------
inputEl.addEventListener("input", e => {
  if (!isStarted) {
    startTyping();
  }

  const newValue = e.target.value;

  if (newValue.length > currentWord.length) return;

  const lastChar = newValue[newValue.length - 1];
  const expected = currentWord[newValue.length - 1];

  // 正誤判定
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

// ------------------------------
// スタート処理（React の handleStart）
// ------------------------------
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

// ------------------------------
// カテゴリ変更（React の handleCategoryChange）
// ------------------------------
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

// ------------------------------
// キーボード押下（React の pressedKey）
// ------------------------------
document.addEventListener("keydown", e => highlightKey(e.key));
document.addEventListener("keyup", e => unhighlightKey(e.key));

// ------------------------------
// 効果音 ON/OFF
// ------------------------------
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  document.getElementById("soundIcon").textContent = soundEnabled ? "🔊" : "🔇";
});

// ------------------------------
// BGM ON/OFF（React の Web Audio API 部分）
// ------------------------------
bgmToggle.addEventListener("click", () => {
  bgmEnabled = !bgmEnabled;

  if (bgmEnabled) {
    bgmContext = new AudioContext();
    bgmOsc = bgmContext.createOscillator();
    const gain = bgmContext.createGain();

    bgmOsc.frequency.value = 440;
    gain.gain.value = 0.05;

    bgmOsc.connect(gain);
    gain.connect(bgmContext.destination);
    bgmOsc.start();

    document.getElementById("bgmIcon").textContent = "🎵";
  } else {
    if (bgmOsc) bgmOsc.stop();
    if (bgmContext) bgmContext.close();
    document.getElementById("bgmIcon").textContent = "🎶";
  }
});
