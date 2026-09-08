(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  const video = document.getElementById('heroVideo');
  const toggle = document.getElementById('vidToggle');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && video) {
    video.pause();
    if (toggle) toggle.hidden = true;
  }
  toggle?.addEventListener('click', () => {
    if (!video) return;
    if (video.paused) {
      video.play();
      toggle.textContent = 'Παύση video';
      toggle.setAttribute('aria-pressed', 'false');
    } else {
      video.pause();
      toggle.textContent = 'Play video';
      toggle.setAttribute('aria-pressed', 'true');
    }
  });
})();
