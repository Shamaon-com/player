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
    console.log(router.query)
    const{id} = router.query;
    if (id !== undefined) {
      const { id, failover } = router.query;

      genSources(id, failover);
    }
  }, [router.query])

  async function genSources(idIncoming, failover) {
    if (idIncoming !== null && failover !== null) {
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

 function recordingRequest(data){
  const text = data;
  if (data.record === "false"){
    return false;
  } else{
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

