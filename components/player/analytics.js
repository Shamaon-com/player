import { useEffect } from 'react';
import ReactGA from 'react-ga';


const analytics = ( trackingCode ) => {

    useEffect(() =>{ 

        ReactGA.initialize(trackingCode, {
            siteSpeedSampleRate: 100,
        });

        // track page view
        ReactGA.pageview(window.location.pathname + window.location.search);

    }, [])

    const event = ( event, playbackId ) => {

        ReactGA.event({
            category: 'Video',
            action: event,
            label: playbackId,
          });
    }


    return { event }
}

export default analytics;