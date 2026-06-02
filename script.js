// ============================================================
// 1. DINAMIC SPARKLES EFFECT (Lienzo de Chispas)
// ============================================================
(function() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.fade = Math.random() * 0.005 + 0.002;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < -10) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = `rgba(196, 122, 90, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 45; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ============================================================
// 2. BACKGROUND MUSIC SYSTEM
// ============================================================
(function() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;

  function toggle() {
    if (playing) {
      audio.pause();
      btn.innerText = '🎵';
    } else {
      audio.play().catch(() => {});
      btn.innerText = '⏸';
    }
    playing = !playing;
  }

  btn.addEventListener('click', toggle);

  // Auto-play intent standard handler
  document.addEventListener('click', () => {
    if(!playing && audio.paused) {
      // Opcional: Descomentar si deseas forzar reproducción en primer clic global
      // toggle();
    }
  }, { once: true });
})();

// ============================================================
// 3. TARGET REALTIME COUNTDOWN
// ============================================================
(function() {
  const target = new Date('2026-10-25T19:00:00').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(interval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const domD = document.getElementById('cd-d');
    const domH = document.getElementById('cd-h');
    const domM = document.getElementById('cd-m');
    const domS = document.getElementById('cd-s');

    if(domD) domD.innerText = String(d).padStart(2, '0');
    if(domH) domH.innerText = String(h).padStart(2, '0');
    if(domM) domM.innerText = String(m).padStart(2, '0');
    if(domS) domS.innerText = String(s).padStart(2, '0');
  }

  const interval = setInterval(update, 1000);
  update();
})();

// ============================================================
// 4. SCROLL INTERSECTION REVEAL TO ANIMATE
// ============================================================
(function() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();

// ============================================================
// 5. RSVP INTERACTIVE MODAL CONTROL
// ============================================================
(function() {
  const openBtn = document.getElementById('open-rsvp-btn');
  const closeBtn = document.getElementById('close-rsvp-btn');
  const modal = document.getElementById('modal-rsvp');
  const form = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  if (!modal) return;

  if(openBtn) openBtn.addEventListener('click', () => { modal.class.add('open'); success.style.display = 'none'; if(form) form.style.display = 'block'; });
  if(closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Simulación de envío
      form.style.display = 'none';
      if(success) success.style.display = 'block';
      setTimeout(() => { modal.classList.remove('open'); }, 3000);
    });
  }
})();

// ============================================================
// 6. CLIPBOARD UTILITY TOAST
// ============================================================
window.copyToClipboard = function(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
  });
};

// ============================================================
// 7. IMAGE LAZY FADE-IN LOADER
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.photo-frame img, .gallery-item img, .polaroid-img-wrap img, .gracias-photo img');
  images.forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });
});

// ============================================================
// 8. POLAROID GALLERY SWIPE LOGIC
// ============================================================
(function() {
  const track = document.getElementById('polaroid-track');
  if(!track) return;
  const slides = document.querySelectorAll('.polaroid-slide');
  const dots   = document.querySelectorAll('.pdot');
  let current  = 0;
  let startX   = 0;
  let isDragging = false;

  function goTo(n) {
    if(!slides.length) return;
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Touch support
  track.parentElement.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.parentElement.addEventListener('touchend', e => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    isDragging = false;
  });

  // Mouse drag support
  track.parentElement.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
  track.parentElement.addEventListener('mouseup', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    isDragging = false;
  });
})();
