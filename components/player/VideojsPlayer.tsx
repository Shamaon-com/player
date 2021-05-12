
import videojs from 'video.js';
import { useRef, useEffect, useState } from 'react';
import livepeerHook from './livepeerHook';
import analytics from './analytics';
import 'video.js/dist/video-js.css';
import styles from './player.module.css'
import LoadingOverlay from './LoadingOverlay';
import customAnalytics from './customAnalytics';


type videojsOptions = {
  controls: boolean,
  poster: string,
  autoplay: boolean,
  muted: boolean
  smoothQualityChange: boolean
}

const VideojsPlayer = ({
  videojsOptions,
  playbackIds,
  backUpservice
}) => {

  const { currentActiveSource, checkForFailover } = livepeerHook(playbackIds, backUpservice);
  const { event } = analytics('UA-167329045-2');
  const { trackEvent } = customAnalytics(playbackIds[0]);
  const playerRef = useRef<HTMLVideoElement | null>(null)

  const [currentState, setCurrentState] = useState("");

  useEffect(() => {

    if (!currentActiveSource) return

    console.log("creating player");
    const player = videojs(playerRef.current, videojsOptions)

    player.ready(function() {
      this.src({
        src: currentActiveSource.src,
        type: 'application/x-mpegURL',
      });
    });

    player.on(['firstplay'], () => {
      setCurrentState('playing');
      trackEvent("firstplay", currentActiveSource.src)
    });

    player.on(['waiting', 'ended', 'durationchange'], () => {
      setCurrentState('waiting');
    });

    player.on([
      'play',
      'playing',
      'seeking'
    ],
      function (data) {
        setCurrentState(data.type);
      });

    player.on(['error'], function (data) {
      console.log(data.type);
      checkForFailover();
    });

  }, [currentActiveSource]);


  useEffect(() => {
    if (!currentActiveSource) return
    console.log("State change:", currentState);
    event(currentState, currentActiveSource.src);
    if (currentState === "waiting") {
      console.log("SetTimeout active");
      const timer = setTimeout(() => {
        console.log("Checking for active source...");
        event("FailoverTrigger", currentActiveSource.src);
        trackEvent("FailoverTrigger", currentActiveSource.src)
        checkForFailover();
      }, 5500);
      return () => {
        clearTimeout(timer);
      }
    };
    console.log("Cleared SetTimeout by", currentState);
    return
  }, [currentState]);

  //<LoadingOverlay live={currentActiveSource ? true : false}/>
  //{!currentActiveSource && <div className={styles.overlay}> OFFLINE </div>}
  return (
    <div className={styles.core}>
      <video ref={playerRef} className="video-js vjs-fluid vjs-big-play-centered" />
      {!currentActiveSource && <img className={styles.overlay} src={videojsOptions.poster}/>}
    </div>
  )
}

export default VideojsPlayer