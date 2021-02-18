import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayer from '../components/videoPlayer'
import { unstable_batchedUpdates } from 'react-dom';

export default function Home() {
  const [sources,setSources] = useState([{id:1 , src:"source 1"}, {id:2 , src:"source 2"},{id:3 , src:"source 3"}, {id:4 , src:"source 4"},]);
  const router = useRouter();
  const[id, setId] = useState(null);
  const [currentSrc ,setCurrentSrc] = useState({id:1 , src:"https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"});

  

  useEffect(() => {

    if(router.query.id !== undefined){
      console.log(router.query.id)
      const { id } = router.query;
      setId(id);
    }
  },[router.query])

  useEffect(()=> {
    const newSrc = sources.map((item, index) => {
      return{
       id: item.id,
       src: item.src + id,
       }         
     })
     console.log(id)
     console.log(newSrc)
     setSources(newSrc);

  }, [id]) 

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

  const renderVideoPlayer = () =>{
    
    return (
      <>
      {currentSrc && <VideoPlayer {...buildObject()}/>}
      </>
    )
  }

  return (
    <div>
      {renderVideoPlayer()}
    </div>

  )
}

