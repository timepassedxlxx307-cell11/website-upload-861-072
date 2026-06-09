(function() {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var links = document.querySelector('[data-nav-links]');
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener('click', function() {
            var opened = links.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var previous = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, position) {
                slide.classList.toggle('active', position === index);
            });
            dots.forEach(function(dot, position) {
                dot.classList.toggle('active', position === index);
            });
        }
        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function(dot, position) {
            dot.addEventListener('click', function() {
                show(position);
                restart();
            });
        });
        if (previous) {
            previous.addEventListener('click', function() {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                show(index + 1);
                restart();
            });
        }
        restart();
    }

    function decadeMatches(value, year) {
        if (!value) {
            return true;
        }
        var numericYear = parseInt(year, 10);
        var decade = parseInt(value, 10);
        if (!numericYear) {
            return false;
        }
        if (decade === 1980) {
            return numericYear < 1990;
        }
        return numericYear >= decade && numericYear < decade + 10;
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function(panel) {
            var root = panel.parentElement;
            var search = panel.querySelector('[data-movie-search]');
            var typeFilter = panel.querySelector('[data-type-filter]');
            var yearFilter = panel.querySelector('[data-year-filter]');
            var grid = root ? root.querySelector('[data-movie-grid]') : null;
            var emptyTip = root ? root.querySelector('[data-empty-tip]') : null;
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
            function apply() {
                var query = search ? search.value.trim().toLowerCase() : '';
                var typeValue = typeFilter ? typeFilter.value : '';
                var yearValue = yearFilter ? yearFilter.value : '';
                var visible = 0;
                cards.forEach(function(card) {
                    var text = [
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.genre,
                        card.dataset.tags,
                        card.dataset.year
                    ].join(' ').toLowerCase();
                    var typeMatches = !typeValue || (card.dataset.type || '').indexOf(typeValue) !== -1 || (card.dataset.genre || '').indexOf(typeValue) !== -1;
                    var yearMatches = decadeMatches(yearValue, card.dataset.year || '');
                    var queryMatches = !query || text.indexOf(query) !== -1;
                    var shouldShow = typeMatches && yearMatches && queryMatches;
                    card.hidden = !shouldShow;
                    if (shouldShow) {
                        visible += 1;
                    }
                });
                if (emptyTip) {
                    emptyTip.hidden = visible !== 0;
                }
            }
            [search, typeFilter, yearFilter].forEach(function(input) {
                if (input) {
                    input.addEventListener('input', apply);
                    input.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    window.initMoviePlayer = function(options) {
        ready(function() {
            var video = document.getElementById(options.videoId);
            var overlay = document.getElementById(options.overlayId);
            var button = document.getElementById(options.buttonId);
            var streamUrl = options.streamUrl;
            var hlsInstance = null;
            var attached = false;
            if (!video || !streamUrl) {
                return;
            }
            function attachStream() {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = streamUrl;
                }
            }
            function start() {
                attachStream();
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function() {});
                }
            }
            if (overlay) {
                overlay.addEventListener('click', start);
            }
            if (button) {
                button.addEventListener('click', start);
            }
            video.addEventListener('click', function() {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener('play', function() {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
            window.addEventListener('pagehide', function() {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    };

    ready(function() {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
