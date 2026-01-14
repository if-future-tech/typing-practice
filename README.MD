# Typing Practice App

このディレクトリは、GitHub Pagesで公開できるタイピング練習サイトです。  
Figma のデザインを基準に UI を構築し、HTML/CSS/JSで実装されています。

---

## 📁 words.json について

出題される単語・文章は `public/words.json` に定義されています。

### 構造

```ts
export type WordCategory = {
  id: string;      // カテゴリID（ユニーク）
  name: string;    // 表示名
  words: string[]; // 出題される単語・文章
};

export type WordData = {
  categories: WordCategory[];
};

編集方法
public/words.json を開く
categories 配列に新しいカテゴリを追加する
既存カテゴリの words に単語や文章を追加するだけでOK

例
{
  "id": "basic",
  "name": "基本単語",
  "words": ["hello world", "typing speed"]
}
📁ディレクトリ構成（抜粋）
typing-practice/
├─ index.html
├─ styles/
├─ scripts/
└─ public/
   └─ words.json        ← 出題データ（ここに置く）

🔧出題データの読み込み
アプリ側では以下のように読み込みます。
const res = await fetch('/words.json');
const data: WordData = await res.json();

📝 注意点
JSON 内にコメントを入れる場合は .jsonc として扱うか、ビルド時に除去してください
GitHub Pages では静的ファイルとしてそのまま配信されます
出題内容は自由に追加・編集できます

📄 ライセンス
MITライセンスに準拠しますが、寄付は歓迎です。
