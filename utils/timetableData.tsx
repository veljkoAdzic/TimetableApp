import { loadData, storeData } from "./localStorage";
import { EventData } from "@/constants/EventTypes";

const endpoints = {
    version: '/version',
    classes: '/classes?',
    timetable: '/timetable?'
}

async function getData(url: string): Promise<string|null>{
    // const data = await fetch(url)
    // .then(x => x.json())
    // .then(y => {return y})
    // .catch(err => {console.error("ERROR: " + err); return null})

    try{
        const resp = await fetch(url)
        const data = await resp.json()
        return data.data || null;
    }
    catch(err) {
        console.log('[getData]: Error ' + err)
        return null;
    }
}

export async function isVersionUpToDate(rootURL: string){    
    try {
        const data = await getData(`${rootURL}${endpoints.version}`);
        const stored = await loadData('latestVersion')
        console.log('[isVersionUpToDate] ' + rootURL +': ' + data + " | stored: " + stored)
        if(data == null){
            throw `Unable to get data from ${rootURL}${endpoints.version}`
        } else{
            if(stored == null){
                //await storeData('latestVersion', data)
                console.log("[isVersionUpToDate] TEMP: storing '" + data + "' to 'latestVersion'")
                return false;
            } else {
                return stored == data;
            }
        }
    } catch (err) {
        console.log("[isVersionUpToDate] Error: " + err)
        return false;
    }
}