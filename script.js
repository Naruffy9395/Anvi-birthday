/* ---------- CONFETTI BACKGROUND ---------- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const colors = ['#FF6FA3', '#FFD6E7', '#FFB6C9', '#FFF0F6', '#FFC9DE'];
let pieces = [];

function createPiece() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 8 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 2 + 1,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 4 - 2
  };
}
for (let i = 0; i < 50; i++) {
  const p = createPiece();
  p.y = Math.random() * canvas.height;
  pieces.push(p);
}
function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p, i) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
    if (p.y > canvas.height + 20) pieces[i] = createPiece();
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

/* ---------- SCROLL REVEAL ANIMATIONS ---------- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealEls.forEach((el) => revealObserver.observe(el));
