(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initFilters() {
        var blocks = document.querySelectorAll("[data-filter]");
        blocks.forEach(function (block) {
            var input = block.querySelector("[data-filter-input]");
            var cards = block.querySelectorAll("[data-card]");
            if (!input || !cards.length) {
                return;
            }
            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.textContent
                    ].join(" ").toLowerCase();
                    card.classList.toggle("is-hidden-card", keyword && text.indexOf(keyword) === -1);
                });
            });
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    window.initPlayer = function (streamUrl) {
        var video = document.getElementById("moviePlayer");
        var overlay = document.getElementById("playOverlay");
        if (!video || !streamUrl) {
            return;
        }
        var loaded = false;

        function attachStream() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                video.hlsInstance = hls;
            } else {
                video.src = streamUrl;
            }
            loaded = true;
        }

        function playVideo() {
            attachStream();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        }

        attachStream();

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
    };

    onReady(function () {
        initMenu();
        initFilters();
        initHero();
    });
})();
