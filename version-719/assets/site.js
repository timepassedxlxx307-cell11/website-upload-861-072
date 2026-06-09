(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
      if (image.parentElement) {
        image.parentElement.classList.add('cover-fallback');
      }
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function collectText(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-year'),
      card.getAttribute('data-type'),
      card.getAttribute('data-tags'),
      card.textContent
    ].join(' ').toLowerCase();
  }

  document.querySelectorAll('[data-search-target]').forEach(function (input) {
    var targetId = input.getAttribute('data-search-target');
    var target = targetId ? document.getElementById(targetId) : null;
    if (!target) {
      return;
    }
    var cards = Array.prototype.slice.call(target.querySelectorAll('[data-card]'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = collectText(card);
        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  });


  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
    var selected = '全部';

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = collectText(card);
        var type = card.getAttribute('data-type') || '';
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesType = selected === '全部' || type === selected;
        card.classList.toggle('is-hidden', !(matchesKeyword && matchesType));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        selected = button.getAttribute('data-filter') || '全部';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });
  });
})();
