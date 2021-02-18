import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayer from '../components/videoPlayer'

export default function Home() {
  const [sources, setSources] = useState([{ id: 1, src: "source 1" }, { id: 2, src: "source 2" }, { id: 3, src: "source 3" }, { id: 4, src: "source 4" },]);
  const router = useRouter();
  const [id, setId] = useState(null);
  const [currentSrc, setCurrentSrc] = useState({ id: 1, src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8" });
  const [switcher, setSwitcher] = useState(true);


  useEffect(() => {

    if (router.query.id !== undefined) {
      console.log(router.query.id)
      const { id } = router.query;
      setId(id);
    }
  }, [router.query])

  useEffect(() => {
    const newSrc = sources.map((item, index) => {
      return {
        id: item.id,
        src: item.src + id,
      }
    })
    console.log(id)
    console.log(newSrc)
    setSources(newSrc);

  }, [id])

  // creating video object
  const buildObject = () => {
    return {
      autoplay: true,
      controls: true,
      sources: [{
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
        {currentSrc && <VideoPlayer {...buildObject()} />}
      </>
    )
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
    xhr.open('GET', src, true);

    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (!parseRequest(xhr.responseText)) {
            setSwitcher(false);
          } else if (player === null) {
            setSwitcher(true);
          }
        }
      } else {
        console.error(xhr.statusText);
        setSwitcher(false);
      }
    }
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
      setSwitcher(false);
    };
    xhr.send(null);
  }

  return (
    <div className="w-screen h-screen">
      {switcher ? renderVideoPlayer() : renderNoSrc()}
    </div>

  )
}

