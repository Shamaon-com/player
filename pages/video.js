import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayerNew from '../components/videoPlayerNew'
import axios from 'axios';

export default function Home() {
  const [sources, setSources] = useState([
    { type: "master", src: "https://fra-cdn.livepeer.com/hls", status: "off" },
    { type: "failover", src: "https://lon-cdn.livepeer.com/hls", status: "off" },
  ]);
  const [updates, setUpdates] = useState(0)
  const router = useRouter();


  useEffect(() => {
    
    const {main, failover} = parseQuery(router.asPath.split("?")[1]);

    console.log("trigger useEffect")
    if (validate(main, failover)) {
      initializeSources(main, failover);
    } else {
      router.push("/")
    }
  }, [])


  const initializeSources = (main, failover) => {
    sources.map((item, index) => {
      const source = {
        type: item.type,
        src: `${item.src}/${item.type === "master" ? main : failover}/index.m3u8`,
        status: 'pending'
      }
      fetchSourcePlaylist(source, index);
      return source;
    });
  };


  const fetchSourcePlaylist = async (source, index) => {
    var intermediate = sources;
    intermediate[index].src = source.src;

    axios.get(source.src).then(function(response){
      if(parseSourcePlaylist(response.data)){
        intermediate[index].status = "available";
      }else{
        intermediate[index].status = "noOutput";
      }
    }).catch(function(error){
      intermediate[index].status = "error";
      console.log(error);
    });
    console.log([...intermediate])
    setSources([...intermediate])
  }



  function validate(id, failover) {
    if (id == null || failover == null) {
      return false;
    } else if (id == undefined || failover == undefined) {
      return false;
    } else if (id == "" || failover == "") {
      return false;
    }
    return true;
  }

  function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  function parseSourcePlaylist(data) {
    const text = data;
    var pos = text.split("\n");
    if (pos[1] == "#EXT-X-ERROR: Stream open failed\r") {
      return false;
    }
    return true;
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
    console.log("render player")
    for( var i = 0; i < sources.length; i++){
      console.log(sources[i])
      if(sources[i].status === "available"){
        return <VideoPlayerNew source={sources[i]} index={i} fetchSourcePlaylist={fetchSourcePlaylist} />
      }
    }
    return renderNoSrc();
  }

  return (
    <div className="w-screen h-screen">
      {renderVideoPlayer()}
    </div>

  )
}

