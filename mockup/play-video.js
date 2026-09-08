(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video[data-autoplay]').forEach((video) => {
    if (reduce) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener('canplay', play);
    video.addEventListener('loadeddata', play);
    document.addEventListener('pointerdown', play, { once: true });
  });
})();
