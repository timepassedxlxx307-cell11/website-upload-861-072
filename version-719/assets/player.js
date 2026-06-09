(function () {
  window.initMoviePlayer = function (url) {
    var video = document.getElementById('movie-video');
    var button = document.getElementById('player-start');
    var frame = document.querySelector('.player-frame');
    var hlsInstance = null;

    if (!video || !button || !url) {
      return;
    }

    function ready(callback) {
      if (video.getAttribute('data-ready') === '1') {
        callback();
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.setAttribute('data-ready', '1');
        callback();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        video.setAttribute('data-ready', '1');
        callback();
        return;
      }

      var existing = document.querySelector('script[data-hls-loader]');
      if (existing) {
        existing.addEventListener('load', function () {
          ready(callback);
        });
        existing.addEventListener('error', function () {
          video.src = url;
          video.setAttribute('data-ready', '1');
          callback();
        });
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.async = true;
      script.setAttribute('data-hls-loader', '1');
      script.onload = function () {
        ready(callback);
      };
      script.onerror = function () {
        video.src = url;
        video.setAttribute('data-ready', '1');
        callback();
      };
      document.head.appendChild(script);
    }

    function play() {
      ready(function () {
        if (frame) {
          frame.classList.add('is-playing');
        }
        button.style.display = 'none';
        var action = video.play();
        if (action && typeof action.catch === 'function') {
          action.catch(function () {
            button.style.display = 'flex';
            if (frame) {
              frame.classList.remove('is-playing');
            }
          });
        }
      });
    }

    button.addEventListener('click', play);

    if (frame) {
      frame.addEventListener('click', function (event) {
        if (event.target === frame || event.target === video) {
          if (video.paused) {
            play();
          }
        }
      });
    }

    video.addEventListener('play', function () {
      button.style.display = 'none';
      if (frame) {
        frame.classList.add('is-playing');
      }
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        button.style.display = 'flex';
        if (frame) {
          frame.classList.remove('is-playing');
        }
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
