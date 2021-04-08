
import {useEffect, useState } from 'react';
import axios from 'axios';


enum ranks {
  master = 1,
  failover = 2,
  backup = 3
}


export type Source = {
  order: ranks,
  src: string,
  available: boolean
}


const livepeerHook = (
    playbackIds: string[],
    backUpservice: string
) => {
  
    const [sources, setSources] = useState<Source[]>([]);
    const [ currentActiveSource, setCurrentActiveSource ] = useState<Source>()
    const edgeEndpoint: Array<string> = [
      "https://fra-cdn.livepeer.com/hls",
      "https://lon-cdn.livepeer.com/hls",
      "https://nyc-cdn.livepeer.com/hls",
      "https://mdw-cdn.livepeer.com/hls"
    ]
  
  
    /**
     *  Fetch master and failover playlists and check if stream is active
     */
    useEffect(() => {
      checkForFailover();
    }, []);


    /**
     * 
     */
    useEffect(() => {
        const sorted = sortSources();
        for (var i = 0; i < sorted.length; i++) {
            if (sorted[i].available) {
                console.log("Current active source", sorted[i]);
                setCurrentActiveSource(sorted[i]);
                return;
            }
        }
        setCurrentActiveSource(null)
    }, [sources]);


    /**
     * 
     */
    const checkForFailover = async () => {
        playbackIds.forEach((element, index) => {
            const source: Source = {
                order: index === 0 ? ranks.master : ranks.failover,
                src: `${edgeEndpoint[index]}/${element}/index.m3u8`,
                available: false
            }
            fetchSourcePlaylist(source, index);
      });
      if (backUpservice) {
        const source: Source = {
          order: ranks.backup,
          src: backUpservice,
          available: false
        }
        fetchSourcePlaylist(source, playbackIds.length + 1)
      }
    }
  
  
    /**
     * 
     * @param source 
     * @param index 
     */
    const fetchSourcePlaylist = async (source: Source, index: number) => { 
      axios.get(source.src).then((response) => {
        source.available = parseSourcePlaylist(response.data);
        setSources((prevSources) => {
          const result = prevSources.filter(prevSource => prevSource.src !== source.src)
          return [...result, source]
        });
  
      }).catch((error) => {
        //console.log(error);
        source.available = false;
        sources.splice(index, 1, source);
        setSources([...sources]);
      });
    };
  

    /**
     * 
     * @param data 
     * @returns 
     */
    const parseSourcePlaylist = (data: string): boolean => {
      return data.split("\n")[1] !== "#EXT-X-ERROR: Stream open failed\r"
    };
  
    /**
     * 
     * @returns 
     */
    const sortSources = () => {
      return sources.sort(function(a, b) {
        return a.order - b.order;
        });
    }
  
    return { currentActiveSource, checkForFailover }
}
  
export default livepeerHook;
  