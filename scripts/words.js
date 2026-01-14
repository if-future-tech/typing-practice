// words.js（GitHub Pages対応・完全版）

// グローバルに words データを保持
window.wordData = {
  categories: []
};

// words.json を読み込む関数
function loadWords() {
  fetch("public/words.json")
    .then(response => {
      if (!response.ok) {
        console.error("words.json が読み込めませんでした:", response.status);
        return;
      }
      return response.json();
    })
    .then(data => {
      if (!data) return;

      // グローバル変数に保存
      window.wordData = data;

      console.log("words.json 読み込み成功:", window.wordData);
    })
    .catch(err => {
      console.error("words.json 読み込みエラー:", err);
    });
}
