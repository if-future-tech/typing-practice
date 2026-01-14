export let wordData = null;

fetch("public/words.json")
  .then(res => res.json())
  .then(data => {
    wordData = data;
    populateCategories();
    loadRandomWord();
  });
