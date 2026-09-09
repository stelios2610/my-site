(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.hero-video').forEach((video) => {
    const media = video.closest('.hero-media');
    const fail = () => media?.classList.add('no-video');
    video.addEventListener('error', fail);
    if (reduced) {
      fail();
      return;
    }
    const tryPlay = () => {
      if (video.paused) video.play().catch(() => {});
    };
    video.addEventListener('loadeddata', tryPlay, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
  });
})();
