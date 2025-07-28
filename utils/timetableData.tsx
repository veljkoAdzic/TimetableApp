import { loadData, storeData } from "./localStorage";
import { EventData } from "@/constants/EventTypes";
import { API_MAP, DEVELOPER_MODE } from "@/constants/Settings";

async function getData(url: string) {
    try{
        let res = await fetch(url)
        let data = await res.json()
        return data
    } catch (err) {
        console.log("[getData]:", err)
        return null
    }    
}

export async function getClassList(rootURL: string){    
    
    const fullURL = rootURL + API_MAP.classList.path
    let res = await getData(fullURL)
    .then((rawJson: {label: string, value: string }) => { 
        if(rawJson == null){
            if(DEVELOPER_MODE)
                console.log(`[getClassList]: Unable to get data from ${fullURL}`)
            return []
        } 

        let res: {label: string, value: string }[] = [] 
        for (let [value, label] of Object.entries(rawJson)) {
            res.push({value, label})
        }

        return res
    })
    return res
}