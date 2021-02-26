import React, {useRef, useEffect} from 'react';
import videojs from 'video.js'

export default function VideoPlayerNew(props) {
  const { videoSrc } = props;
  const playerRef = useRef();

  useEffect(() => {
    const player = videojs(playerRef.current, { autoplay: true, muted: true }, () => {
      player.src(videoSrc);
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full">
      <video ref={playerRef} className="video-js vjs-16-9 w-full h-full vjs-big-play-centered" playsInline />
    </div>
  );
}
