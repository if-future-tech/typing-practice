function playErrorSound() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 200;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 100);
}

