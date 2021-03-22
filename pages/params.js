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
  const [cartela, setCartela] = useState("");
  const [background, setBackground] = useState("");
  const router = useRouter();


  useEffect(() => {

    const {main, failover, cartela} = parseQuery(router.asPath.split("?")[1]);

    console.log(main, failover);
    console.log(cartela);

    if(validate(main, failover)){
      setCartela(cartela); 
      setBackground(`https://iframes-shamaon.s3-eu-west-1.amazonaws.com/cartelas/${cartela}`);
      setMain(main); setFailover(failover);
    }
  }, []);


  useEffect(() => {

    if(validate(main, failover)){
      initializeSources(main, failover);


      setInterval(() => {
        console.log("Settings interval to 30 sec")
        initializeSources(main, failover);
      }, 30000);
      return () => {
        clearInterval();
      };
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



  const fetchSourcePlaylist = async (source, index) => {
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
      <div 
        style={{
          height: "100vh",
          backgroundImage: "url(" + background + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <p style={{margin: "0px", textAlign: "center"}}>El streaming esta offline</p>
      </div>
    )
  }

  //https://rework.dtbfvdqj3z1vk.amplifyapp.com/params.html?main=d2cd773eb6wmcph8&failover=97845ve1il1tavab
  const renderVideoPlayer = () => {

    console.log("trying to build player")
    console.log(sources)
    for (var i = 0; i < sources.length; i++) {
      if (sources[i].status === "available") {
        return <VideoPlayerNew key={i} source={sources[i]} index={i} initializeSources={initializeSources} cartela={cartela}/>
      }
    }
    return renderNoSrc();
  }
  
  return (
    <div style={{ widht:"100%"}}
    >
      {renderVideoPlayer()}
    </div>

  )
}

