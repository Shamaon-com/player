import VideojsPlayer from '../components/player/VideojsPlayer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function Params() {


  const [playbackIds, setPlaybackIds] = useState([])
  const [videojsOptions, setVideojsOptions] = useState({})
  const [backup, setBackup] = useState();
  const router = useRouter();

  useEffect(() => {


    const { main, failover, backup, poster } = parseQuery(router.asPath.split("?")[1]);
    console.log(main, failover, poster);

    const videojsOptions = {
      controls: true,
      poster: 'https://iframes-shamaon.s3-eu-west-1.amazonaws.com/cartelas/' + poster,
      autoplay: true,
      muted: false,
      plugins: {
        mux: {
          debug: false,
          data: {
            env_key: "1dig8elvkcvlig1p812n6s19h", // required

            // Metadata
            player_name: main+failover,
            player_init_time: Date.now() // ex: 1451606400000

            // ... and other metadata
          }
        }
      }
    }
    setBackup(backup)
    setPlaybackIds([main, failover]);
    setVideojsOptions(videojsOptions)
  }, [])


  const parseQuery = (queryString) => {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }



  return (
    <div style={{ width: '100%' }}>
      <VideojsPlayer
        playbackIds={playbackIds}
        videojsOptions={videojsOptions}
        backUpservice={backup}
      />
    </div>

  )
}
