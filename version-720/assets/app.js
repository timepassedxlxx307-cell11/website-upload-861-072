(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                var url = "search.html";
                if (value) {
                    url += "?q=" + encodeURIComponent(value);
                }
                window.location.href = url;
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var currentSlide = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            currentSlide = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === currentSlide);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === currentSlide);
            });
        }

        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(currentSlide - 1);
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                showSlide(currentSlide + 1);
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });
        showSlide(0);
        if (slides.length > 1) {
            setInterval(function () {
                showSlide(currentSlide + 1);
            }, 5200);
        }

        var filterInput = document.querySelector("[data-filter-input]");
        var regionFilter = document.querySelector("[data-region-filter]");
        var typeFilter = document.querySelector("[data-type-filter]");
        var yearFilter = document.querySelector("[data-year-filter]");
        var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
        var emptyState = document.querySelector("[data-empty-state]");

        function applyQueryFromUrl() {
            if (!filterInput) {
                return;
            }
            var params = new URLSearchParams(window.location.search);
            var keyword = params.get("q");
            if (keyword) {
                filterInput.value = keyword;
            }
        }

        function applyFilters() {
            if (!items.length) {
                return;
            }
            var keyword = normalize(filterInput && filterInput.value);
            var region = normalize(regionFilter && regionFilter.value);
            var type = normalize(typeFilter && typeFilter.value);
            var year = normalize(yearFilter && yearFilter.value);
            var visible = 0;

            items.forEach(function (item) {
                var text = normalize(item.getAttribute("data-search"));
                var itemRegion = normalize(item.getAttribute("data-region"));
                var itemType = normalize(item.getAttribute("data-type"));
                var itemYear = normalize(item.getAttribute("data-year"));
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (region && itemRegion !== region) {
                    matched = false;
                }
                if (type && itemType !== type) {
                    matched = false;
                }
                if (year && itemYear !== year) {
                    matched = false;
                }
                item.classList.toggle("hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("show", visible === 0);
            }
        }

        applyQueryFromUrl();
        [filterInput, regionFilter, typeFilter, yearFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
        applyFilters();
    });
})();

function initMoviePlayer(videoId, buttonId, mediaUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var hlsInstance = null;
    var prepared = false;

    if (!video || !button || !mediaUrl) {
        return;
    }

    function prepare() {
        if (prepared) {
            return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                lowLatencyMode: true,
                enableWorker: true
            });
            hlsInstance.loadSource(mediaUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = mediaUrl;
        }
    }

    function play() {
        prepare();
        button.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (!prepared) {
            play();
        }
    });
    video.addEventListener("play", function () {
        button.classList.add("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
