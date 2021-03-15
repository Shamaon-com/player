import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import VideoPlayerNew from '../components/videoPlayerNew'
import axios from 'axios';

export default function Home() {
  const [sources, setSources] = useState([
    { type: "master", src: "https://fra-cdn.livepeer.com/hls", status: "off" },
    { type: "failover", src: "https://lon-cdn.livepeer.com/hls", status: "off" },
  ]);
  const [main, setMain] = useState("");
  const [failover, setFailover] = useState("");

  const router = useRouter();

  const Background = "https://iframes-shamaon.s3-eu-west-1.amazonaws.com/cartelas/catela_eres.png";

  useEffect(() => {

    const {main, failover} = parseQuery(router.asPath.split("?")[1]);

    console.log(main, failover);

    if(validate(main, failover)){
      setMain(main); setFailover(failover);
    }
  }, []);


  useEffect(() => {

    if(validate(main, failover)){
      initializeSources(main, failover);
    }

  }, [main, failover])

  const initializeSources = () => {
    const mainSrc = "https://fra-cdn.livepeer.com/hls/"+ main +"/index.m3u8";
    const failoverSrc = "https://lon-cdn.livepeer.com/hls/"+ failover +"/index.m3u8";
    sources.map((item, index) => {
      const source = {
        type: item.type,
        src: `${item.type === "master" ? mainSrc : failoverSrc}`,
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
      <div className="bg-black h-full"
      style={{backgroundImage: "url(" + Background + ")",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"}}
      >
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
    <div className="w-full h-screen"
    >
      {renderVideoPlayer()}
    </div>

  )
}

