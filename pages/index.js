import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayerNew from '../components/videoPlayerNew'
import axios from 'axios';

export default function Home() {
  const [sources, setSources] = useState([
    { type: "master", src: "https://fra-cdn.livepeer.com/hls", status: "off" },
    { type: "failover", src: "https://lon-cdn.livepeer.com/hls", status: "off" },
  ]);



  useEffect(() => {
    /*
    const {main, failover} = parseQuery(router.asPath.split("?")[1]);

    console.log("trigger useEffect")
    if (validate(main, failover)) {
      initializeSources(main, failover);
    } else {
      router.push("/")
    }

    */

    const main = "3f82w8e75tfe09gg";
    const failover = "49f6y2m5144phuf7";
    initializeSources();
  }, [])


  useEffect(() => {
    setInterval(() => {
      console.log("Settings interval to 30 sec")
      initializeSources();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  const initializeSources = () => {
    const main = "https://fra-cdn.livepeer.com/hls/3f82w8e75tfe09gg/index.m3u8";
    const failover = "https://lon-cdn.livepeer.com/hls/49f6y2m5144phuf7/index.m3u8";
    sources.map((item, index) => {
      const source = {
        type: item.type,
        src: `${item.type === "master" ? main : failover}`,
        status: 'pending'
      }
      fetchSourcePlaylist(source, index);
      return source;
    });
  };



  const fetchSourcePlaylist = (source, index) => {
    var intermediate = sources;
    intermediate[index].src = source.src;

    axios.get(source.src).then(function(response){
      if(parseSourcePlaylist(response.data)){
        intermediate[index].status = "available";
      }else{
        intermediate[index].status = "noOutput";
      }
      setSources([...intermediate])
    }).catch(function(error){
      intermediate[index].status = "error";
      console.log(error);
      setSources([...intermediate])
    });  
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
      <div className="bg-black h-full">
        <p className="text-center text-white">El streaming esta offline</p>
      </div>
    )
  }

  const renderVideoPlayer = () => {

    console.log("trying to build player")
    console.log(sources)
    for (var i = 0; i < sources.length; i++) {
      if (sources[i].status === "available") {
        return <VideoPlayerNew key={i} source={sources[i]} index={i} initializeSources={initializeSources} />
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

