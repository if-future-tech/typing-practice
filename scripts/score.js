export function updateScore(score) {
  document.getElementById("correctCount").textContent = score.correct;
  document.getElementById("mistakeCount").textContent = score.mistakes;
}
// scripts/score.js

export function calculateScore(correct, mistakes, elapsedTime) {
  const total = correct + mistakes;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : "0.0";

  const minutes = elapsedTime / 60;
  const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;

  return { accuracy, wpm };
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function renderScoreBoard(correct, mistakes, elapsedTime) {
  const { accuracy, wpm } = calculateScore(correct, mistakes, elapsedTime);

  const scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.innerHTML = `
    <div class="stat-card blue">
      <div class="stat-icon">⏱</div>
      <div>
        <p class="stat-label">経過時間</p>
        <p class="stat-value">${formatTime(elapsedTime)}</p>
      </div>
    </div>

    <div class="stat-card green">
      <div class="stat-icon">🎯</div>
      <div>
        <p class="stat-label">正解数</p>
        <p class="stat-value">${correct}</p>
      </div>
    </div>

    <div class="stat-card red">
      <div class="stat-icon">⚠️</div>
      <div>
        <p class="stat-label">ミス数</p>
        <p class="stat-value">${mistakes}</p>
      </div>
    </div>

    <div class="stat-card purple">
      <div class="stat-icon">📈</div>
      <div>
        <p class="stat-label">精度</p>
        <p class="stat-value">${accuracy}%</p>
      </div>
    </div>

    <div class="stat-card indigo">
      <div class="stat-icon">⌨️</div>
      <div>
        <p class="stat-label">WPM</p>
        <p class="stat-value">${wpm}</p>
      </div>
    </div>
  `;
}
