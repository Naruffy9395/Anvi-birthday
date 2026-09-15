/* ============================================
   CONFETTI BACKGROUND
   ============================================ */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#FF6FA3', '#FFD6E7', '#FFB6C9', '#FFF0F6', '#FFC9DE', '#FFD700'];
let confettiPieces = [];

function createConfettiPiece() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: Math.random() * 8 + 6,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    speedY: Math.random() * 2 + 1,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 4 - 2,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  };
}

for (let i = 0; i < 60; i++) {
  const p = createConfettiPiece();
  p.y = Math.random() * canvas.height;
  confettiPieces.push(p);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach((p, i) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (p.y > canvas.height + 20) confettiPieces[i] = createConfettiPiece();
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => revealObserver.observe(el));

/* ============================================
   INTERACTIVE CAKE - BLOW OUT CANDLE
   ============================================ */
const cakeContainer = document.getElementById('cakeContainer');
const flame = document.querySelector('.flame');
const cakeMessage = document.getElementById('cakeMessage');
let candleBlown = false;

if (cakeContainer) {
  cakeContainer.addEventListener('click', () => {
    if (candleBlown) {
      // Relight the candle
      candleBlown = false;
      flame.classList.remove('out');
      cakeMessage.classList.remove('show');
      return;
    }

    candleBlown = true;
    flame.classList.add('out');

    // Burst of confetti from candle position
    const rect = cakeContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;

    for (let i = 0; i < 40; i++) {
      const piece = createConfettiPiece();
      piece.x = cx;
      piece.y = cy;
      piece.speedY = -(Math.random() * 6 + 3);
      piece.speedX = (Math.random() * 8 - 4);
      piece.size = Math.random() * 10 + 6;
      confettiPieces.push(piece);
    }

    // Trim excess pieces so performance stays smooth
    if (confettiPieces.length > 120) {
      confettiPieces = confettiPieces.slice(-120);
    }

    setTimeout(() => {
      cakeMessage.classList.add('show');
    }, 400);
  });
}

/* ============================================
   POLAROID RANDOM TILT
   ============================================ */
document.querySelectorAll('.polaroid').forEach((p, i) => {
  const tilt = i % 2 === 0 ? -2 : 2;
  p.style.transform = `rotate(${tilt}deg)`;
  p.dataset.tilt = tilt;
});

// Override hover to remove tilt smoothly
document.querySelectorAll('.polaroid').forEach((p) => {
  const tilt = p.dataset.tilt;
  p.addEventListener('mouseenter', () => {
    p.style.transform = 'translateY(-8px) rotate(0deg) scale(1.03)';
  });
  p.addEventListener('mouseleave', () => {
    p.style.transform = `rotate(${tilt}deg)`;
  });
});

/* ============================================
   SMOOTH SCROLL FOR SCROLL HINT
   ============================================ */
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  scrollHint.style.cursor = 'pointer';
  scrollHint.addEventListener('click', () => {
    const gridSection = document.querySelector('.photo-grid-section');
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
