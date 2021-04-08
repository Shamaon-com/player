import VideojsPlayer from '../components/player/VideojsPlayer';
import {useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export default function Params() {


  const [ playbackIds, setPlaybackIds ] = useState([])
  const [ videojsOptions, setVideojsOptions ] = useState({})
  const backup = ""; 
  const router = useRouter();

  useEffect(() => {
    

    const {main, failover, poster} = parseQuery(router.asPath.split("?")[1]);
    console.log(main, failover, poster);

    const videojsOptions = {
      controls: true,
      poster: 'https://iframes-shamaon.s3-eu-west-1.amazonaws.com/cartelas/' + poster,
      autoplay: true,
      muted: false
   }

    setPlaybackIds([main, failover]);
    setVideojsOptions(videojsOptions)
  }, [])


  const  parseQuery = (queryString) => {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }



  return (
    <div style={{width: '100%'}}>
      <VideojsPlayer 
        playbackIds={playbackIds} 
        videojsOptions={videojsOptions} 
        backUpservice={backup}
      />
    </div>

  )
}
