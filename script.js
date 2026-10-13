const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const baSlider = document.getElementById('baSlider');
const baBefore = document.getElementById('baBefore');
const baHandle = document.getElementById('baHandle');
let dragging = false;

function setSlider(x) {
  const rect = baSlider.getBoundingClientRect();
  let pct = ((x - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, pct));
  baBefore.style.clipPath = `inset(0 0 0 ${pct}%)`;
  baHandle.style.left = pct + '%';
}

baSlider.addEventListener('pointerdown', e => {
  dragging = true;
  baSlider.setPointerCapture(e.pointerId);
  setSlider(e.clientX);
});
baSlider.addEventListener('pointermove', e => {
  if (dragging) setSlider(e.clientX);
});
baSlider.addEventListener('pointerup', () => { dragging = false; });
baSlider.addEventListener('pointercancel', () => { dragging = false; });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);
    const numEl = entry.target.querySelector('.stat-num');
    const target = parseInt(entry.target.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      numEl.textContent = Math.floor(progress * target).toLocaleString('en');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat').forEach(el => statsObserver.observe(el));
