// scripts/keyboard.js

const keyboardLayout = [
  [
    { key: '`', display: '`' },
    { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' },
    { key: '5' }, { key: '6' }, { key: '7' }, { key: '8' },
    { key: '9' }, { key: '0' }, { key: '-' }, { key: '=' },
    { key: 'Backspace', display: '⌫', width: 'key-wide' }
  ],
  [
    { key: 'Tab', display: 'Tab', width: 'key-mid' },
    { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' },
    { key: 't' }, { key: 'y' }, { key: 'u' }, { key: 'i' },
    { key: 'o' }, { key: 'p' }, { key: '[' }, { key: ']' },
    { key: '\\' }
  ],
  [
    { key: 'CapsLock', display: 'Caps', width: 'key-wide' },
    { key: 'a', isHomeRow: true },
    { key: 's', isHomeRow: true },
    { key: 'd', isHomeRow: true },
    { key: 'f', isHomeRow: true },
    { key: 'g' }, { key: 'h' },
    { key: 'j', isHomeRow: true },
    { key: 'k', isHomeRow: true },
    { key: 'l', isHomeRow: true },
    { key: ';', isHomeRow: true },
    { key: "'" },
    { key: 'Enter', display: '⏎', width: 'key-wide' }
  ],
  [
    { key: 'Shift', display: 'Shift', width: 'key-xl' },
    { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' },
    { key: 'b' }, { key: 'n' }, { key: 'm' },
    { key: ',' }, { key: '.' }, { key: '/' },
    { key: 'Shift', display: 'Shift', width: 'key-xl' }
  ],
  [
    { key: 'Control', display: 'Ctrl', width: 'key-mid' },
    { key: 'Alt', display: 'Alt', width: 'key-mid' },
    { key: ' ', display: 'Space', width: 'key-space' },
    { key: 'Alt', display: 'Alt', width: 'key-mid' },
    { key: 'Control', display: 'Ctrl', width: 'key-mid' }
  ]
];

function renderKeyboard() {
  const root = document.getElementById("softKeyboard");
  root.innerHTML = "";

  keyboardLayout.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";

    row.forEach(keyData => {
      const keyEl = document.createElement("div");
      keyEl.className = `key ${keyData.width || ''}`;
      keyEl.dataset.key = keyData.key.toLowerCase();

      keyEl.innerHTML = `
        <span>${keyData.display || keyData.key.toUpperCase()}</span>
        ${keyData.isHomeRow ? `<div class="home-dot"></div>` : ""}
      `;

      rowEl.appendChild(keyEl);
    });

    root.appendChild(rowEl);
  });
}

function highlightKey(key) {
  const el = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
  if (el) el.classList.add("pressed");
}

function unhighlightKey(key) {
  const el = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
  if (el) el.classList.remove("pressed");
}

function markExpectedKey(key) {
  document.querySelectorAll(".key").forEach(k => k.classList.remove("expected"));
  const el = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
  if (el) el.classList.add("expected");
}
