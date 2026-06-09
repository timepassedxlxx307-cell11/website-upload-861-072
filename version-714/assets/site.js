(function () {
  const menuButton = document.querySelector('.js-menu-toggle');
  const mobileNav = document.querySelector('.js-mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-filter-list]').forEach(function (list) {
    const section = list.closest('section') || document;
    const input = section.querySelector('[data-filter-input]');
    const select = section.querySelector('[data-filter-select]');
    const cards = Array.from(list.querySelectorAll('[data-card]'));

    function applyFilter() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const year = select ? select.value : '';

      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || haystack.indexOf(keyword) > -1;
        const matchYear = !year || card.getAttribute('data-year') === year;
        card.style.display = matchKeyword && matchYear ? '' : 'none';
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });

  const searchResults = document.querySelector('[data-search-results]');
  if (searchResults && window.MOVIE_CATALOG) {
    const params = new URLSearchParams(window.location.search);
    const searchInput = document.querySelector('[data-global-search]');
    const typeSelect = document.querySelector('[data-global-type]');
    const regionSelect = document.querySelector('[data-global-region]');

    if (searchInput) {
      searchInput.value = params.get('q') || '';
    }

    function render() {
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const typeValue = typeSelect ? typeSelect.value : '';
      const regionValue = regionSelect ? regionSelect.value : '';
      const items = window.MOVIE_CATALOG.filter(function (item) {
        const haystack = [item.title, item.genre, item.region, item.type, item.year, item.tags, item.oneLine].join(' ').toLowerCase();
        const matchKeyword = !keyword || haystack.indexOf(keyword) > -1;
        const matchType = !typeValue || item.type.indexOf(typeValue) > -1;
        const matchRegion = !regionValue || item.region.indexOf(regionValue) > -1;
        return matchKeyword && matchType && matchRegion;
      }).slice(0, 120);

      searchResults.innerHTML = items.map(function (item) {
        return '<article class="movie-card">' +
          '<a class="poster-wrap" href="./' + item.url + '" aria-label="' + escapeHtml(item.title) + '">' +
            '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.classList.add(\'is-missing\')">' +
            '<span class="poster-shade"></span>' +
            '<span class="play-dot">▶</span>' +
          '</a>' +
          '<div class="movie-card-body">' +
            '<a class="movie-title" href="./' + item.url + '">' + escapeHtml(item.title) + '</a>' +
            '<p>' + escapeHtml(item.oneLine) + '</p>' +
            '<div class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
            '<div class="tag-row"><span>' + escapeHtml(item.category) + '</span></div>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"]/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[char];
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', render);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', render);
    }
    if (regionSelect) {
      regionSelect.addEventListener('change', render);
    }
    render();
  }
}());
