(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function setHero(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });

    heroDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var next = parseInt(dot.getAttribute('data-hero-dot'), 10);
      setHero(next);
    });
  });

  if (heroSlides.length > 1) {
    window.setInterval(function () {
      setHero(heroIndex + 1);
    }, 5200);
  }

  var heroSearch = document.querySelector('[data-hero-search] input');

  if (heroSearch) {
    heroSearch.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var value = encodeURIComponent(heroSearch.value.trim());
        window.location.href = 'search.html' + (value ? '?q=' + value : '');
      }
    });
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var input = filterPanel.querySelector('[data-filter-input]');
    var chips = Array.prototype.slice.call(filterPanel.querySelectorAll('[data-filter-chip]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var activeChip = 'all';
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var queryMatch = !query || text.indexOf(query) !== -1;
        var chipMatch = activeChip === 'all' || text.indexOf(activeChip.toLowerCase()) !== -1;
        var show = queryMatch && chipMatch;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeChip = chip.getAttribute('data-filter-chip') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        applyFilter();
      });
    });

    applyFilter();
  }

  var video = document.querySelector('[data-video]');

  if (video) {
    var streamUrl = video.getAttribute('data-video');
    var overlay = document.querySelector('[data-player-overlay]');
    var playButton = document.querySelector('[data-play-button]');
    var hlsInstance = null;

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('hide');
      }
    }

    function showOverlay() {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('hide');
      }
    }

    function attachStream() {
      if (!streamUrl) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else {
        video.src = streamUrl;
      }
    }

    function startPlayback() {
      attachStream();
      var promise = video.play();
      hideOverlay();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('hide');
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('play', hideOverlay);
    video.addEventListener('pause', showOverlay);
    video.addEventListener('ended', showOverlay);

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
}());
