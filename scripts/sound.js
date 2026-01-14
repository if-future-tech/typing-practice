/* ============================
   サウンド管理フラグ
============================ */
//let isSoundMuted = false; // 効果音ミュート
//let isBgmMuted = false;   // BGMミュート

/* ============================
   効果音（タイプ音・正解音・エラー音）
============================ */

// エラー音（クリック時にヘッダーが伸びないように短く軽量）
function playErrorSound() {
  if (isSoundMuted) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 200;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 100);
}

// 必要なら他の効果音も同じ方式で追加
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

/* ============================
   BGM（ループ再生）
============================ */
const bgm = new Audio("assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.4;

/* ============================
   トグル処理（ボタン）
============================ */

// 効果音ミュート切り替え
function toggleSound() {
  isSoundMuted = !isSoundMuted;

  const icon = document.getElementById("soundIcon");
  if (icon) {
    icon.textContent = isSoundMuted ? "🔇" : "🔊";
  }
}

// BGMミュート切り替え
function toggleBGM() {
  isBgmMuted = !isBgmMuted;

  if (isBgmMuted) {
    bgm.pause();
  } else {
    bgm.play();
  }

  const icon = document.getElementById("bgmIcon");
  if (icon) {
    icon.textContent = isBgmMuted ? "🔕" : "🎵";
  }
}

/* ============================
   ボタンイベント登録
============================ */
window.addEventListener("DOMContentLoaded", () => {
  const soundBtn = document.getElementById("soundToggle");
  const bgmBtn = document.getElementById("bgmToggle");

  if (soundBtn) soundBtn.addEventListener("click", toggleSound);
  if (bgmBtn) bgmBtn.addEventListener("click", toggleBGM);
});

/* ============================
   外部から呼べる関数
============================ */
window.playErrorSound = playErrorSound;
window.playTypeSound = playTypeSound;
window.playCorrectSound = playCorrectSound;

