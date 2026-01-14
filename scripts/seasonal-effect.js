// scripts/seasonal-effect.js

(function () {
  const canvas = document.getElementById("seasonal-effect");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let particles = [];
  let animationFrameId = null;

  function getSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createParticle(season) {
    const p = {
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      vx: 0,
      vy: 0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      size: 0,
      opacity: 0.3 + Math.random() * 0.3,
      flicker: undefined
    };

    switch (season) {
      case "spring":
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = 0.5 + Math.random() * 0.5;
        p.size = 8 + Math.random() * 6;
        break;

      case "summer":
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = (Math.random() - 0.5) * 0.8;
        p.size = 3 + Math.random() * 2;
        p.flicker = Math.random() * Math.PI * 2;
        p.opacity = 0.5;
        break;

      case "autumn":
        p.vx = (Math.random() - 0.5) * 1;
        p.vy = 0.8 + Math.random() * 0.7;
        p.size = 10 + Math.random() * 8;
        break;

      case "winter":
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = 0.3 + Math.random() * 0.4;
        p.size = 3 + Math.random() * 4;
        p.rotationSpeed = 0;
        break;
    }

    return p;
  }

  function initParticles() {
    const season = getSeason();
    const count = season === "summer" ? 15 : 30;
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(season));
    }
  }

  function drawParticle(p, season) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);

    switch (season) {
      case "spring":
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#FFB7C5";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * p.size;
          const y = Math.sin(angle) * p.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case "summer":
        const glow = Math.sin(p.flicker || 0) * 0.5 + 0.5;
        ctx.globalAlpha = p.opacity * glow;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
        gradient.addColorStop(0, "rgba(255,255,150,1)");
        gradient.addColorStop(0.5, "rgba(255,255,100,0.5)");
        gradient.addColorStop(1, "rgba(255,255,50,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(-p.size * 3, -p.size * 3, p.size * 6, p.size * 6);

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#FFFF88";
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "autumn":
        ctx.globalAlpha = p.opacity;
        const colors = ["#D2691E", "#FF8C00", "#CD853F", "#8B4513"];
        ctx.fillStyle = colors[Math.floor(p.x % colors.length)];

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(139,69,19,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();
        break;

      case "winter":
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#E0F2FE";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
          ctx.stroke();
        }
        break;
    }

    ctx.restore();
  }

  function animate() {
    const season = getSeason();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      if (season === "summer" && p.flicker !== undefined) {
        p.flicker += 0.1;
      }

      if (season === "spring" || season === "autumn") {
        p.x += Math.sin(p.y * 0.01) * 0.2;
      }

      if (
        p.y > canvas.height + 50 ||
        p.x < -50 ||
        p.x > canvas.width + 50
      ) {
        particles[i] = createParticle(season);
      }

      drawParticle(p, season);
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();
})();
