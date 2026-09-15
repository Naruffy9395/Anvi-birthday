/* ============================================
   CONFETTI — optimized, fewer pieces
   ============================================ */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let cw, ch;

function resizeCanvas() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#FF6FA3', '#FFD6E7', '#FFB6C9', '#FFC9DE', '#FFD700'];
let pieces = [];
const MAX_PIECES = 35;

function createPiece() {
  return {
    x: Math.random() * cw,
    y: -20,
    size: Math.random() * 6 + 4,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    speedY: Math.random() * 1.5 + 0.8,
    speedX: Math.random() * 1.5 - 0.75,
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 3 - 1.5,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  };
}

for (let i = 0; i < MAX_PIECES; i++) {
  const p = createPiece();
  p.y = Math.random() * ch;
  pieces.push(p);
}

let confettiActive = true;

function animateConfetti() {
  if (!confettiActive) return;
  ctx.clearRect(0, 0, cw, ch);
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
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
    if (p.y > ch + 20) pieces[i] = createPiece();
  }
  requestAnimationFrame(animateConfetti);
}

/* Only run confetti when the hero is visible to save CPU */
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const heroObserver = new IntersectionObserver((entries) => {
    confettiActive = entries[0].isIntersecting;
    if (confettiActive) requestAnimationFrame(animateConfetti);
  });
  heroObserver.observe(heroEl);
} else {
  requestAnimationFrame(animateConfetti);
}

/* ============================================
   SCROLL REVEAL
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
   FLIP BOOK — scroll-driven page turn
   ============================================ */
const bookTrack = document.getElementById('bookTrack');
const bookPages = document.querySelectorAll('.page');

if (bookTrack && bookPages.length > 0) {
  const numPages = bookPages.length;

  function updateBook() {
    const rect = bookTrack.getBoundingClientRect();
    const trackHeight = bookTrack.offsetHeight;
    const scrollable = trackHeight - window.innerHeight;

    if (scrollable <= 0) return;

    const scrolledInto = Math.max(0, -rect.top);
    let progress = scrolledInto / scrollable;
    progress = Math.max(0, Math.min(1, progress));

    const totalProgress = progress * numPages;

    bookPages.forEach((page, i) => {
      let local = totalProgress - i;
      local = Math.max(0, Math.min(1, local));

      const rotation = -180 * local;
      page.style.transform = `rotateY(${rotation}deg)`;

      if (local > 0.5) {
        page.style.zIndex = i + 1;
      } else {
        page.style.zIndex = numPages - i + 10;
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateBook();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateBook();
}

/* ============================================
   SCRAPBOOK TILT
   ============================================ */
document.querySelectorAll('.scrap').forEach((s) => {
  const r = getComputedStyle(s).getPropertyValue('--r').trim();
  s.style.transform = `rotate(${r})`;
});

/* ============================================
   POLAROID TILT + HOVER
   ============================================ */
document.querySelectorAll('.polaroid').forEach((p, i) => {
  const tilt = i % 2 === 0 ? -2 : 2;
  p.style.transform = `rotate(${tilt}deg)`;
  p.dataset.tilt = tilt;
  p.addEventListener('mouseenter', () => {
    p.style.transform = 'translateY(-6px) rotate(0deg) scale(1.03)';
  });
  p.addEventListener('mouseleave', () => {
    p.style.transform = `rotate(${tilt}deg)`;
  });
});

/* ============================================
   CAKE INTERACTION
   ============================================ */
const cakeContainer = document.getElementById('cakeContainer');
const flame = document.getElementById('flame');
const cakeMessage = document.getElementById('cakeMessage');
let candleBlown = false;

if (cakeContainer) {
  cakeContainer.addEventListener('click', () => {
    if (candleBlown) {
      candleBlown = false;
      flame.classList.remove('out');
      cakeMessage.classList.remove('show');
      return;
    }
    candleBlown = true;
    flame.classList.add('out');

    const rect = cakeContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    for (let i = 0; i < 30; i++) {
      const piece = createPiece();
      piece.x = cx;
      piece.y = cy;
      piece.speedY = -(Math.random() * 5 + 2);
      piece.speedX = (Math.random() * 6 - 3);
      pieces.push(piece);
    }
    if (pieces.length > 80) pieces = pieces.slice(-80);
    if (!confettiActive) {
      confettiActive = true;
      requestAnimationFrame(animateConfetti);
    }
    setTimeout(() => cakeMessage.classList.add('show'), 400);
  });
}

/* ============================================
   SMOOTH SCROLL HINT
   ============================================ */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => {
    const target = document.querySelector('.photo-grid-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}
