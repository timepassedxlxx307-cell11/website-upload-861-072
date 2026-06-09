(function () {
    var form = document.querySelector("[data-local-search-form]");
    var input = document.querySelector("[data-local-search-input]");
    var results = document.querySelector("[data-search-results]");
    var empty = document.querySelector("[data-search-empty]");
    var defaults = document.querySelector("[data-search-default]");

    if (!form || !input || !results || typeof MOVIE_INDEX === "undefined") {
        return;
    }

    function card(movie) {
        return [
            '<article class="movie-card">',
            '<a class="poster" href="' + movie.url + '">',
            '<img class="poster-img" src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-shade"></span>',
            '<span class="poster-badges"><span>' + movie.rating + ' 分</span></span>',
            '</a>',
            '<div class="card-content">',
            '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.genre) + ' · ' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</p>',
            '<div class="card-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.genre.split(/[，,/、]/)[0]) + '</span></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (item) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[item];
        });
    }

    function render(term) {
        var query = String(term || "").trim().toLowerCase();
        results.innerHTML = "";
        if (!query) {
            if (empty) {
                empty.classList.add("is-visible");
            }
            if (defaults) {
                defaults.style.display = "";
            }
            return;
        }
        var found = MOVIE_INDEX.filter(function (movie) {
            return movie.text.toLowerCase().indexOf(query) !== -1;
        }).slice(0, 160);
        results.innerHTML = found.map(card).join("");
        if (empty) {
            empty.classList.toggle("is-visible", found.length === 0);
        }
        if (defaults) {
            defaults.style.display = found.length ? "none" : "";
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        render(input.value);
        var url = new URL(window.location.href);
        if (input.value.trim()) {
            url.searchParams.set("q", input.value.trim());
        } else {
            url.searchParams.delete("q");
        }
        history.replaceState(null, "", url.toString());
    });

    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    render(initial);
})();
