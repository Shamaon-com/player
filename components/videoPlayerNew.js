import React, { useRef, useEffect } from 'react';
import videojs from 'video.js'
import * as gtag from '../lib/gtag'

export default function VideoPlayerNew(props) {
  // https://fra-cdn.livepeer.com/hls/8e70cnvvusc2cdk5/index.m3u8 


  const playerRef = useRef();

  useEffect(() => {
    const player = videojs(playerRef.current, { controls: true, autoplay: false, muted: true }, () => {
      player.src({
        src: props.source.src,
        type: 'application/x-mpegURL'
      });
    });

    player.on(['play', 'durationchange', 'stalled', 'ended', 'seeking', 'seeked', 'waiting', 'playing', 'pause', 'volumechange'],
      function (data) {
        console.log(data)
        gtag.event({
          action: data.type,
          category: 'Videos',
          label: player.src(),
          value: Math.floor(player.currentTime)
        })
    });

    player.on(['error', 'waiting', 'durationchange'], function (data) {
      console.log(data)
      props.fetchSourcePlaylist(props.source, props.index);
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full">
      <video ref={playerRef} className="video-js vjs-16-9 w-full h-full vjs-big-play-centered" />
    </div>
  );
}
