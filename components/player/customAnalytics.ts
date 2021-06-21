import { useState, useEffect, useReducer} from 'react';
import axios from 'axios';
import {v4 as uuid} from 'uuid';
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
    
        return await axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=4b7f2f8e7c9c48a48eaaceb753aad91c").then((response) => {
            return {ip:response.data.ip, state_prov: response.data.state_prov} 
        }).catch((e) => {
            console.log(e)
            return {ip: "", state_prov: ""}
        })
       
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
            location: locationData.state_prov,
            ip: locationData.ip
        }
        console.log(trackObject)
        return trackObject
    }

    const trackEvent = async (eventType:string, eventValue:string) => {
        var trackObject = await track()
        trackObject['eventType'] = eventType
        trackObject['eventValue'] = eventValue
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