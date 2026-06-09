function startMoviePlayer(streamUrl) {
    var video = document.getElementById("movie-player");
    var layer = document.getElementById("play-layer");
    var attached = false;
    var hls = null;

    if (!video || !layer || !streamUrl) {
        return;
    }

    function attach() {
        if (attached) {
            return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function play() {
        attach();
        layer.classList.add("is-hidden");
        video.setAttribute("controls", "controls");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    layer.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
}
