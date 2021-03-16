import React, { useRef, useEffect } from 'react';
import videojs from 'video.js'
import * as gtag from '../lib/gtag'

export default function VideoPlayerNew(props) {
  // https://fra-cdn.livepeer.com/hls/8e70cnvvusc2cdk5/index.m3u8 


  const playerRef = useRef();

  useEffect(() => {

    const player = videojs(playerRef.current, { 
      
      controls: true, 
      poster: "", 
      autoplay: false, muted: true }, () => {
        player.src({
          src: props.source.src,
          type: 'application/x-mpegURL',
        });
    });

    player.play();

    player.on(['play', 'durationchange', 'stalled', 'ended', 'seeking', 'seeked', 'waiting', 'playing', 'pause', 'volumechange'],
      function (data) {
        //console.log(data)
        gtag.event({
          action: data.type,
          category: 'Videos',
          label: player.src(),
          value: Math.floor(player.currentTime)
        })
    });

    player.on(['error', 'durationchange', 'waiting'], function (data) {
      console.log(data);
      //props.fetchSourcePlaylist(props.source, props.index);
      props.initializeSources();
    });

    return () => {
      console.log("dispose");
      player.dispose();
    };
  }, []);

  const loadVideoComponent = () => {
    console.log("Building for", props.source.src)
    return <video ref={playerRef}  className="video-js vjs-big-play-centered" />

  }
  return (
    <div data-vjs-player style={{width: "100%", height: "100vh"}}>
      {loadVideoComponent() }
    </div>
  );
}
