import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayer from '../components/videoPlayer'

export default function Home() {
  const [sources, setSources] = useState([{ id: 1, src: "1" }, { id: 2, src: "2" }, { id: 3, src: "3" }, { id: 4, src: "4" },]);
  const router = useRouter();
  const [id, setId] = useState(null);
  const [currentSrc, setCurrentSrc] = useState({ id: 1, src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8" });
  const [switcher, setSwitcher] = useState(false);

  useEffect(() => {
    if (router.query.id !== undefined) {
      console.log(router.query.id)
      const { id } = router.query;
      setId(id);
    }
  }, [router.query])

  useEffect(() => {
    if (id != null){
      const newSrc = sources.map((item, index) => {
        return {
          id: item.id,
          src: item.src + id,
        }
      })
    console.log(id)
    console.log(newSrc)
    setSources(newSrc);
    loadSrc();
    }
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      loadSrc();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function loadSrc() {
    try{
      sources.map((item) => {
        checkSource(item.src);
      })
      if (!currentSrc){
        setSwitcher(false);
      }
    }catch(e){
      console.log(e)
    }
  }

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
        {<VideoPlayer {...buildObject()}/>}
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

  async function checkSource(item) {
    fetch(item.src)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log(response.status);
          return;
        }
        response.text().then(function(data) {
          if(parseRequest(data)){
            setCurrentSrc(item)
            setSwitcher(true)
          }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  
  }

  return (
    <div className="w-screen h-screen">
      {switcher ? renderVideoPlayer() : renderNoSrc()}
    </div>

  )
}

