import { useState, useEffect, useReducer} from 'react';
import axios from 'axios';
import uuid from 'uuid';
import { createAnalytic } from '../../src/graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';


const customAnalytics = (projectId:string) => {

    const [userId, setUserId] = useState("")
    const [location, setLocation] = useState(null)

    useEffect(() => {
        authenticate();
    }, []);


    const authenticate = () => {

        try {
            const userId = localStorage.getItem('shamaonUserId')
            setUserId(userId);
            if(!userId){
                firstRequest();
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const firstRequest = async () => {
  
        const userId = uuid()
        setUserId(userId);
        var trackObject = await track()
        trackObject['userId'] = userId
        trackObject['eventType'] = "general"
        trackObject['eventValue'] = "firstLoad"
        localStorage.setItem('shamaonUserId', userId)
        try{
            API.graphql(graphqlOperation(createAnalytic, { input: trackObject }));
            
        }catch(e){
            console.log(e);
        }

    }

    const getPageUrl = () =>  window.location.href


	const findLocation = async () => {
		// navigator.geolocation.getCurrentPosition(
		// 	position => {
		// 		const location = JSON.stringify(position);
        //         console.log(location)
		// 		setLocation({ location });
		// 	},
		// 	error => console.log(error.message),
		// 	{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		// );
    
        var ip = await axios.get("https://api.ipify.org?format=json").then((response) => {
            return response.data.ip  
        }).catch((e) => {
            console.log(e)
        })
        console.log(ip)
        var location = await axios.get(`http://api.ipstack.com/${ip}?access_key=d1385d7e6519612cdd7369e11cf48a76&format=1`).then((response) => {
                console.log(response.data.region_name)
                return response.data.region_name
            }).catch((e) => {
                console.log(e)
                return ""
            })
        return {ip, location}
	};
    
    const getDeviceType = () => navigator.userAgent;


    const track = async () => {
        console.log(userId)
        const locationData  = await findLocation()
        const trackObject = {
            projectId: projectId,
            userId: userId,
            pageUrl: getPageUrl(),
            deviceType: getDeviceType(),
            location: locationData.location,
            ip: locationData.ip
        }
        return trackObject
    }

    const trackEvent = async (eventType:string, eventValue:string) => {
        var trackObject = await track()
        trackObject['eventType'] = eventType
        trackObject['eventValue'] = eventValue
        console.log(trackObject)
        try{
            API.graphql(graphqlOperation(createAnalytic, { input: trackObject }));
            
        }catch(e){
            console.log(e);
        }
       
        return trackObject
    }

    return ({ track, trackEvent })
}

export default customAnalytics;