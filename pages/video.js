import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayerNew from '../components/videoPlayerNew'

export default function Home() {
  const [sources, setSources] = useState([
    { type: "master", src: "https://fra-cdn.livepeer.com/hls/" },
    { type: "failover", src: "https://lon-cdn.livepeer.com/hls/" },
  ]);

  const router = useRouter();
  const [currentSrc, setCurrentSrc] = useState({});
  const [switcher, setSwitcher] = useState(false);

  useEffect(() => {
    
    const {id, failover} = parseQuery(router.asPath.split("?")[1]);
    console.log(id,failover)
    console.log(parseQuery(router.asPath))
    if (validate(id, failover)) {
      genSources(id, failover);
    } else {
      router.push("/")
    }
  }, [])

  function validate(idIncoming, failover) {
    if (idIncoming == null || failover == null) {
      return false;
    } else if (idIncoming == undefined || failover == undefined) {
      return false;
    } else if (idIncoming == "" || failover == "") {
      return false;
    }
    return true;
  }

  function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

  async function genSources(idIncoming, failover) {
    console.log(idIncoming, failover);

    const newSrc = sources.map((item) => {
      if (item.type == "master") {
        return {
          type: item.type,
          src: item.src + idIncoming + "/index.m3u8",
        }
      } else if (item.type == "failover") {
        return {
          type: item.type,
          src: item.src + failover + "/index.m3u8",
        }
      }
    })
    setSources(newSrc);
  }

  useEffect(() => {
    loadSrc();
  }, [sources])


  useEffect(() => {
    const interval = setInterval(() => {
      loadSrc();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [sources]);

  async function loadSrc() {
    try {
      sources.map((item) => {
        checkSource(item);
      })
      if (!currentSrc) {
        setSwitcher(false);
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function checkSource(item) {
    fetch(item.src)
      .then(
        function (response) {
          console.log(response);
          if (response.status !== 200) {
            console.log("status code: ", response.status);
            setSwitcher(false);
            return;
          }
          response.text().then(function (data) {
            if (parseRequest(data) && currentSrc !== null) {
              console.log("update")
              setCurrentSrc(item)
              setSwitcher(true)
            } else {
              setSwitcher(false)
              setCurrentSrc(null)
            }
          });
        }
      )
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });

  }

  function parseRequest(data) {
    const text = data;
    var pos = text.split("\n");
    if (pos[1] == "#EXT-X-ERROR: Stream open failed\r") {
      return false;
    }
    return true;
  }

  function recordingRequest(data) {
    const text = data;
    if (data.record === "false") {
      return false;
    } else {
      return true
    }
  }

  // creating video object
  const buildObject = () => {
    return {
      videoSrc: [{
        src: currentSrc.src,
        type: 'application/x-mpegURL'
      }]
    }
  }

  // display renders for player 

  const renderNoSrc = () => {
    return (
      <div>
        El streaming esta offline
      </div>
    )
  }

  const renderVideoPlayer = () => {
    return (
      <>
        {<VideoPlayerNew {...buildObject()} />}
      </>
    )
  }

  return (
    <div className="w-screen h-screen">
      {switcher ? renderVideoPlayer() : renderNoSrc()}
    </div>

  )
}

