// words.js（GitHub Pages対応・完全版）

// グローバルに words データを保持
window.wordData = {
  categories: []
};

// words.json を読み込む関数
function loadWords(callback) {
  fetch("public/words.json")
    .then(response => response.json())
    .then(data => {
      window.wordData = data;
      console.log("words.json 読み込み成功:", window.wordData);

      if (callback) callback();  // ← 読み込み完了後に実行
    })
    .catch(err => console.error("words.json 読み込みエラー:", err));
}
