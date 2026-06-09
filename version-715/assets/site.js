(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  let heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === heroIndex);
    });

    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === heroIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showHero(index);
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showHero(heroIndex - 1);
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showHero(heroIndex + 1);
    });
  }

  if (slides.length > 1) {
    setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  showHero(0);

  function applySearch(scope) {
    const input = scope.querySelector('[data-search-input]');
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const buttons = Array.from(scope.querySelectorAll('[data-filter]'));
    let activeFilter = 'all';

    function update() {
      const keyword = input ? input.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const category = card.getAttribute('data-category') || '';
        const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchFilter = activeFilter === 'all' || category === activeFilter;

        card.classList.toggle('hidden-by-filter', !(matchKeyword && matchFilter));
      });
    }

    if (input) {
      input.addEventListener('input', update);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter') || 'all';

        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });

        update();
      });
    });

    update();
  }

  Array.from(document.querySelectorAll('.search-scope')).forEach(applySearch);

  Array.from(document.querySelectorAll('.video-player-shell')).forEach(function (shell) {
    const video = shell.querySelector('video');
    const layer = shell.querySelector('.play-layer');
    const stream = shell.getAttribute('data-stream');
    let loaded = false;

    function loadStream() {
      if (!video || !stream || loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      loaded = true;
    }

    function startVideo() {
      if (!video) {
        return;
      }

      loadStream();
      shell.classList.add('is-playing');
      video.play().catch(function () {});
    }

    if (layer) {
      layer.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo();
        }
      });
    }
  });
})();
