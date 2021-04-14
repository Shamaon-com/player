
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
    const [poll, setPoll] = useState(false);
    const edgeEndpoint: Array<string> = [
      "https://cdn.livepeer.com/hls",
      "https://cdn.livepeer.com/hls",
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
        console.log(sorted)
        for (var i = 0; i < sorted.length; i++) {
            if (sorted[i].available) {
                if(currentActiveSource !== sorted[i]){
                  console.log("Current active source", sorted[i]);
                  setCurrentActiveSource(sorted[i]);
                } 
                return;
            }
        }
        console.log("No active source");
        setCurrentActiveSource(null);
    }, [sources]);


      /**
   * Start polling to check if a source becomes active
   * 
   */
       useEffect(() => {
         console.log("Start polling")
        if(!currentActiveSource){
          const timer = setInterval(() => {
            console.log("Sources are being polled");
            checkForFailover();
          }, 5500);
          return () => clearInterval(timer);
        };
        console.log("Cleared polling")
        return
      }, [currentActiveSource])


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
        setSources((prevSources) => {
          const result = prevSources.filter(prevSource => prevSource.src !== source.src)
          return [...result, source]
        });
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
  