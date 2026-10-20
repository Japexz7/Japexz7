const enterScreen = document.getElementById("enterScreen");
const profileCard = document.getElementById("profileCard");
const pageFooter = document.getElementById("pageFooter");
const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const trackState = document.getElementById("trackState");
const equalizer = document.getElementById("equalizer");
const visitCount = document.getElementById("visitCount");
const cursorGlow = document.getElementById("cursorGlow");
const video = document.getElementById("backgroundVideo");

// Tela de entrada. O clique também permite iniciar áudio após interação do visitante.
enterScreen.addEventListener("click", async () => {
  enterScreen.hidden = true;
  profileCard.hidden = false;
  pageFooter.hidden = false;
  // Tenta iniciar o vídeo; se não houver assets/fundo.mp4, o fundo CSS continua visível.
  video.play().catch(() => {});
});

// Texto digitando
const phrases = ["welcome to my profile", "stay a little, explore a little", "online • always evolving"];
const typingText = document.getElementById("typingText");
let phraseIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  const phrase = phrases[phraseIndex];
  typingText.textContent = phrase.slice(0, charIndex);
  if (!deleting && charIndex < phrase.length) {
    charIndex++;
    setTimeout(typeLoop, 70);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1300);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 32);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}
typeLoop();

// Música: adicione seu próprio arquivo assets/musica.mp3.
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicIcon.textContent = "Ⅱ";
      trackState.textContent = "tocando agora";
      equalizer.classList.add("playing");
      musicButton.setAttribute("aria-label", "Pausar música");
    } catch (error) {
      trackState.textContent = "adicione assets/musica.mp3";
    }
  } else {
    music.pause();
    musicIcon.textContent = "▶";
    trackState.textContent = "pausado";
    equalizer.classList.remove("playing");
    musicButton.setAttribute("aria-label", "Tocar música");
  }
});
music.addEventListener("ended", () => {
  musicIcon.textContent = "▶";
  trackState.textContent = "clique para tocar";
  equalizer.classList.remove("playing");
});

// Contador local: conta visitas neste navegador, não é um total global de visitantes.
try {
  const key = "japexz7_local_visits";
  const count = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(count));
  visitCount.textContent = String(count).padStart(3, "0");
} catch {
  visitCount.textContent = "001";
}

// Brilho acompanha o cursor em computadores; desativado em telas touch por CSS.
window.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// Partículas leves em canvas.
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, particles = [];
const particleCount = Math.min(70, Math.max(28, Math.floor(window.innerWidth / 18)));
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.6 + .4,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    alpha: Math.random() * .55 + .15
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < -5) p.x = width + 5;
    if (p.x > width + 5) p.x = -5;
    if (p.y < -5) p.y = height + 5;
    if (p.y > height + 5) p.y = -5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(87, 190, 255, ${p.alpha})`;
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 105) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(58, 153, 255, ${.10 * (1 - distance / 105)})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);
