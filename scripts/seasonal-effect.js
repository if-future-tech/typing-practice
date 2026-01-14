// seasonal-effect.js
(function(){
  const canvas = document.getElementById('seasonal-effect');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let rafId = null;
  let running = false;

  // デバイスピクセル比対応でキャンバスをリサイズ
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    // rect が 0 の場合（まだ非表示等）はビューポートを使う
    const cssWidth = rect.width || window.innerWidth;
    const cssHeight = rect.height || window.innerHeight;
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = cssWidth + 'px';
      canvas.style.height = cssHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  // シンプルな季節エフェクトの例（雪・桜・葉などを切り替え可能）
  // ここでは軽量なパーティクルを描画するサンプルを実装
  const particles = [];
  const MAX_PARTICLES = 60;

  function createParticle() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    return {
      x: Math.random() * w,
      y: -10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.6 + Math.random() * 1.2,
      size: 4 + Math.random() * 8,
      life: 0,
      ttl: 200 + Math.random() * 300,
      color: 'rgba(255,255,255,0.9)' // デフォルトは白（雪）
    };
  }

  function updateParticles() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    while (particles.length < MAX_PARTICLES) {
      particles.push(createParticle());
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.002;
      p.life++;
      if (p.y > h + 20 || p.life > p.ttl) {
        particles.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // 軽く透過を入れて背景に馴染ませる
    ctx.globalAlpha = 0.9;
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderLoop() {
    if (!running) return;
    updateParticles();
    drawParticles();
    rafId = requestAnimationFrame(renderLoop);
  }

  // 公開 API: start / stop / setMode
  function start() {
    if (running) return;
    running = true;
    resizeCanvas();
    rafId = requestAnimationFrame(renderLoop);
  }

  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // 必要ならクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // モード切替（例: snow, petals, leaves）
  function setMode(mode) {
    // 簡易実装：色や挙動を切り替える
    if (mode === 'petals') {
      for (const p of particles) p.color = 'rgba(255,182,193,0.95)'; // 桜色
    } else if (mode === 'leaves') {
      for (const p of particles) p.color = 'rgba(51,153,51,0.95)'; // 緑
    } else {
      for (const p of particles) p.color = 'rgba(255,255,255,0.95)'; // 雪
    }
  }

  // ヘッダー高さに合わせて main の padding-top を同期する（CSS変数更新）
  function syncHeaderHeight() {
    const header = document.querySelector('.header');
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if (!header || !main) return;
    const h = Math.max(48, Math.round(header.getBoundingClientRect().height));
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }

  // 初期化
  function init() {
    resizeCanvas();
    syncHeaderHeight();
    start();
  }

  // イベント
  window.addEventListener('resize', () => {
    resizeCanvas();
    syncHeaderHeight();
  });

  // ヘッダーの内容が動的に変わる場合に備え、MutationObserverで高さ変化を監視
  const headerEl = document.querySelector('.header');
  if (headerEl && window.MutationObserver) {
    const mo = new MutationObserver(() => syncHeaderHeight());
    mo.observe(headerEl, { childList: true, subtree: true, attributes: true });
  }

  // DOMContentLoaded で初期化（index.html で seasonal-effect.js を先に読み込む場合は即 init）
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 公開（デバッグや外部からの制御用）
  window.seasonalEffect = {
    start,
    stop,
    setMode,
    resize: resizeCanvas
  };
})();
