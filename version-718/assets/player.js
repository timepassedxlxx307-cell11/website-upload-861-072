(function () {
    function bindHls(video, streamUrl) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            if (!video.getAttribute("src")) {
                video.setAttribute("src", streamUrl);
            }
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!video.__hlsInstance) {
                var hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                video.__hlsInstance = hls;
            }
            return;
        }

        if (!video.getAttribute("src")) {
            video.setAttribute("src", streamUrl);
        }
    }

    window.initMoviePlayer = function (videoId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.querySelector("[data-player-start]");
        if (!video || !streamUrl) {
            return;
        }

        function begin() {
            bindHls(video, streamUrl);
            video.controls = true;
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", begin);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
    };
})();
