import React, { useState, useEffect } from 'react';
import VideoPlayerNew from '../components/videoPlayerNew'
import axios from 'axios';

export default function Home() {
  const [sources, setSources] = useState([
    { type: "master", src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8", status: "off" }
  ]);


  useEffect(() => {
    initializeSources();
  }, [])


  useEffect(() => {
    setInterval(() => {
      console.log("Settings interval to 30 sec")
      initializeSources();
    }, 30000);
    return () => {
      clearInterval();
    };
  }, [])

  const initializeSources = () => {

    sources.map((item, index) => {
      const source = {
        type: item.type,
        src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
        status: 'pending'
      }
      fetchSourcePlaylist(source, index);
      return source;
    });
  };



  const fetchSourcePlaylist = (source, index) => {
    var intermediate = sources;
    intermediate[index].src = source.src;

    console.log("Requesting", source.src)
    axios.get(source.src).then(function(response){
      if(parseSourcePlaylist(response.data)){
        //intermediate[index].status === "available" ? intermediate[index].status = "active" : intermediate[index].status = "available";
        intermediate[index].status = "available"
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
      <div
        style={{
          height: "100vh",
          backgroundColor: "#000000"
        }}
      >
        <p style={{margin: "0px", textAlign: "center", color: "#ffffff"}}>El streaming esta offline</p>
      </div>
    )
  }

  const renderVideoPlayer = () => {
    console.log(sources)
    for (var i = 0; i < sources.length; i++) {
      if (sources[i].status === "available") {
        return <VideoPlayerNew key={i} source={sources[i]} index={i} initializeSources={initializeSources} />
      }
    }
    return renderNoSrc();
  }
  
  return (
    <div style={{ widht:"100%"}}>
      {renderVideoPlayer()}
    </div>

  )
}

