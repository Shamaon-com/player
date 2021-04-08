
import videojs from 'video.js';
import { useRef, useEffect, useState } from 'react';
import livepeerHook from './livepeerHook';
import analytics from './analytics';
import 'video.js/dist/video-js.css';
import styles from './player.module.css'

type videojsOptions = {
  controls: boolean,
  poster: string,
  autoplay: boolean,
  muted: boolean
}

const VideojsPlayer = ({
  videojsOptions,
  playbackIds,
  backUpservice
}) => {

  const {currentActiveSource, checkForFailover}  = livepeerHook(playbackIds, backUpservice);
  const { event } = analytics('UA-167329045-2');
  const playerRef = useRef<HTMLVideoElement | null>(null)
  
  const [currentState, setCurrentState] = useState("");
  const [poll, setPoll] = useState(false);

  /**
   * Check if current stream is active
   * 
   */
  useEffect(() => {
    if( !currentActiveSource ) return
    console.log(currentState)
    event(currentState, currentActiveSource.src);
    if(currentState === "waiting"){
      const timer = setTimeout(() => {
        checkForFailover();
      }, 5500);
      return () => clearTimeout(timer);
    };
    return
  }, [currentState])
  
  /**
   * Start polling to check if a source becomes active
   * 
   */
     useEffect(() => {
      if(poll){
        const timer = setInterval(() => {
          console.log("Sources are being polled")
          checkForFailover();
        }, 5500);
        return () => clearInterval(timer);
      };
      return
    }, [poll])


  useEffect(() => {
    if( !currentActiveSource ) {
      setPoll(true)
      return
    }
    setPoll(false);
    const player = videojs(playerRef.current, videojsOptions, () => {
        player.src({
          src: currentActiveSource.src,
          type: 'application/x-mpegURL',
        });
      });

    player.on(['firstplay'], () => {
      setCurrentState('playing');
    });

    player.on(['waiting'], () => {
      setCurrentState('waiting');
    });

    player.on([
      'play',
      'durationchange',
      'stalled',
      'ended',
      'seeking',
      'seeked',
      'playing',
      'pause',
      'volumechange'],
      function (data) {
        setCurrentState(data.type);
      });

    player.on(['error'], function (data) {
      console.log(data.type);
      checkForFailover();
    });

  }, [ currentActiveSource ]);




  const renderNoSource = () => {
      return (
        <div
          style={{
            height: "100%",
            width: '100%',
            backgroundColor: "#000000"
          }}
        >
          <p style={{ margin: "0px", textAlign: "center", color: "#ffffff" }}>
            El streaming esta offline
          </p>
        </div>
      )
  }

  return (
    <div className={ styles.core }>
      <video ref={playerRef} className="video-js vjs-fluid vjs-big-play-centered"/>
      {!currentActiveSource && <img className={styles.overlay} src={videojsOptions.poster}/>}
    </div>
  )

}

export default VideojsPlayer