(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector(".nav-toggle");
        var mobile = document.querySelector(".mobile-nav");
        if (!toggle || !mobile) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = mobile.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        document.querySelectorAll(".hero-carousel").forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var prev = carousel.querySelector(".hero-prev");
            var next = carousel.querySelector(".hero-next");
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
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
                    timer = null;
                }
            }

            if (slides.length < 2) {
                return;
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            carousel.addEventListener("mouseenter", stop);
            carousel.addEventListener("mouseleave", start);
            start();
        });
    }

    function setupFiltering() {
        document.querySelectorAll(".site-search").forEach(function (form) {
            var input = form.querySelector(".filter-input");
            if (!input) {
                return;
            }
            var root = form.closest("main") || document;
            var empty = root.querySelector(".empty-state");
            input.addEventListener("input", function () {
                var query = input.value.trim().toLowerCase();
                var items = Array.prototype.slice.call(root.querySelectorAll(".filter-item"));
                var visible = 0;
                items.forEach(function (item) {
                    var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
                    var matched = query === "" || text.indexOf(query) !== -1;
                    item.classList.toggle("hidden-by-filter", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.style.display = visible === 0 ? "block" : "none";
                }
            });
        });
    }

    ready(function () {
        setupNavigation();
        setupHero();
        setupFiltering();
    });
})();
