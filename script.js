function openInvitation() {
  const env = document.getElementById('envelope-page');
  env.classList.add('closing');
  setTimeout(() => {
    env.style.display = 'none';
    document.body.style.overflow = '';
  }, 820);
}
// Prevent scroll while envelope is open
document.body.style.overflow = 'hidden';

/* ============================================================ */

// ============================================================
// 1. SPARKLES CANVAS
// ============================================================
(function() {
  const canvas = document.getElementById('sparkles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const GOLD = ['rgba(220,130,170,', 'rgba(235,160,195,', 'rgba(196,100,140,'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + .4,
      vy: -(Math.random() * .4 + .15),
      vx: (Math.random() - .5) * .25,
      life: 0,
      maxLife: Math.random() * 180 + 80,
      col: GOLD[Math.floor(Math.random() * GOLD.length)]
    };
  }

  for (let i = 0; i < 55; i++) {
    const p = spawn();
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const progress = p.life / p.maxLife;
      const alpha = progress < .2 ? progress / .2 : progress > .8 ? (1 - progress) / .2 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + (alpha * .55) + ')';
      ctx.fill();
      if (p.life >= p.maxLife) particles[i] = spawn();
    });
    requestAnimationFrame(frame);
  }
  frame();
})();


// ============================================================
// 2. COUNTDOWN
// ============================================================
(function() {
  // CAMBIA LA FECHA DEL EVENTO AQUÍ: año, mes-1, día, hora, minuto
  const eventDate = new Date(2026, 5, 27, 18, 0, 0); // 27 junio 2026, 6:00 PM

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now  = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
  }

  update();
  setInterval(update, 1000);
})();


// ============================================================
// 3. MUSIC PLAYER
// ============================================================
(function() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-audio');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!audio.src || audio.src === window.location.href) {
      // No audio source set — show hint
      showToast('Agrega una URL de audio en el código 🎵');
      return;
    }
    if (playing) {
      audio.pause();
      btn.textContent = '🎵';
      playing = false;
    } else {
      audio.play().catch(() => showToast('No se pudo reproducir el audio'));
      btn.textContent = '⏸';
      playing = true;
    }
  });
})();


// ============================================================
// 4. GALLERY LIGHTBOX
// ============================================================
(function() {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      if (!src || src === window.location.href) return;
      lbImg.src = src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLB);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });
})();


// ============================================================
// 5. RSVP MODAL
// ============================================================
(function() {
  const modal    = document.getElementById('modal-rsvp');
  const openBtn  = document.getElementById('open-rsvp-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const submitBtn = document.getElementById('rsvp-submit');
  const formWrap  = document.getElementById('rsvp-form-wrap');
  const success   = document.getElementById('rsvp-success');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('rsvp-name').value.trim();
      const guests = document.getElementById('rsvp-guests').value;
      const confirm = document.getElementById('rsvp-confirm').value;

      if (!name) {
        document.getElementById('rsvp-name').focus();
        showToast('Por favor ingresa tu nombre');
        return;
      }

      const formURL =  "https://docs.google.com/forms/d/e/1FAIpQLSfax4PVa4W6uNJS23nYpkxxqRUnVExj2olkuiPEhsTYbifoxA/formResponse";

      const data = new FormData();

      data.append("entry.1592155856", name);     // Nombre
      data.append("entry.2007813868", guests);   // Acompañantes
      data.append("entry.275275268", confirm);   // Asistencia

      fetch(formURL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      // UI feedback (tu animación actual)
      formWrap.style.display = 'none';
      success.style.display = 'block';

      setTimeout(closeModal, 3500);

      setTimeout(() => {
        formWrap.style.display = 'block';
        success.style.display = 'none';
        document.getElementById('rsvp-name').value = '';
      }, 4000);
    });
})();


// ============================================================
// 6. COPY TO CLIPBOARD
// ============================================================
function copyToClipboard(el) {
  const text = el.getAttribute('data-copy');
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('¡Copiado al portapapeles!');
  }).catch(() => {
    showToast('No se pudo copiar');
  });
}


// ============================================================
// 7. TOAST
// ============================================================
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}


// ============================================================
// 8. SCROLL REVEAL (IntersectionObserver)
// ============================================================
(function() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();


// ============================================================
// 9. STAGGER PORTADA REVEALS ON LOAD
// ============================================================
window.addEventListener('load', () => {
  const items = document.querySelectorAll('#portada .reveal');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 160);
  });
});


// ============================================================
// 10. POLAROID GALLERY SWIPE
// ============================================================
(function() {
  const track = document.getElementById('polaroid-track');
  const slides = document.querySelectorAll('.polaroid-slide');
  const dots   = document.querySelectorAll('.pdot');
  let current  = 0;
  let startX   = 0;
  let isDragging = false;

  function goTo(n) {
    current = (n + 35) % 35;
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

  // Dot clicks
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
})();
