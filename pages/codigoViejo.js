const sources = ["src one", "src two"];

  var video = null;
  var noSrcDiv = document.getElementById("noSrc");
  var player = null;

  async function loadSrc() {
    try{
      for (src in sources) {
        checkSource(sources[src]);
      }
    }catch(e){
      console.log(e)
      clearInterval(myInterval);
    }
  }

  function parseRequest(data) {
    const text = data;
    var pos = text.split("\n");
    if (pos[1] == "#EXT-X-ERROR: Stream open failed\r") {
      return false;
    }
    return true;
  }

  async function checkSource(src) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);  // `false` makes the request synchronous

    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (!parseRequest(xhr.responseText)) {
              disposePlayer(src);
          }else if(player === null){
            buildPlayer(src);
          }
        }
      } else {
        console.error(xhr.statusText);
        disposePlayer();
      }
    }
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
      disposePlayer();
    };
    xhr.send(null);
  };

  function disposePlayer(src){
    if(player !== null && player.currentSrc() === src){
      console.log("trying to dispose", src);
      player.dispose();
      noSrcDiv.style.display = "block";
      player = null;
    }
  }

  function buildPlayer(src) {
    rebuildVideoComponent();
    console.log("building player", src);
    player = videojs("videoestudio");
    player.src({
      src: src,
      type: "application/x-mpegURL",
    });
    noSrcDiv.style.display = "none";
  }

  function rebuildVideoComponent(){
    const contaier = document.getElementById("videoContainer");

    video = document.createElement('video-js');
    video.id = 'videoestudio';
    video.className = 'videoStyle video-js vjs-default-skin';
    video.setAttribute('controls', 'controls');
    video.setAttribute('data-matomo-title', 'videoestudio_icea-19-enero');

    contaier.appendChild(video);
  }


  loadSrc();
  setTimeout(function tick() {
    loadSrc();
    timerId = setTimeout(tick, 15000); 
  }, 15000);