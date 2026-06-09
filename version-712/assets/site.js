(function () {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (button && panel) {
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, position) {
            slide.classList.toggle("is-active", position === active);
        });
        dots.forEach(function (dot, position) {
            dot.classList.toggle("is-active", position === active);
        });
    }

    dots.forEach(function (dot, position) {
        dot.addEventListener("click", function () {
            showSlide(position);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var pageFilter = document.querySelector("[data-page-filter]");
    var pageCards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-page-chip]"));
    var chipValue = "";

    function applyPageFilter() {
        var term = pageFilter ? pageFilter.value.trim().toLowerCase() : "";
        pageCards.forEach(function (card) {
            var text = card.getAttribute("data-search-text") || "";
            var genre = card.getAttribute("data-genre") || "";
            var okTerm = !term || text.indexOf(term) !== -1;
            var okChip = !chipValue || genre === chipValue;
            card.style.display = okTerm && okChip ? "" : "none";
        });
    }

    if (pageFilter) {
        pageFilter.addEventListener("input", applyPageFilter);
    }

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            chipValue = chip.getAttribute("data-page-chip") || "";
            applyPageFilter();
        });
    });

    document.querySelectorAll(".poster-img, .detail-poster img, .category-poster-row img").forEach(function (img) {
        img.addEventListener("error", function () {
            img.style.opacity = "0";
        });
    });
})();
