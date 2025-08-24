import { loadData, storeData } from "./localStorage";
import { DAYS, EventData } from "@/constants/EventTypes";
import { API_MAP, DEVELOPER_MODE } from "@/constants/Settings";
import { formatEventTitle, generateID } from "./eventTools";

async function getData(url: string) {
    const controler = new AbortController();
    const timer = setTimeout(() => {controler.abort()}, 10000)

    try{
        let res = await fetch(url, {signal: controler.signal})
        let data = await res.json()
        clearTimeout(timer)
        return data
    } catch (err) {
        console.log("[getData]:", err)
        return null
    }    
}

export async function getClassList(rootURL: string){    
    const fullURL = rootURL + API_MAP.classList.path

    let res = await getData(fullURL)
    .then((rawJson: {label: string, value: string } | null) => { 
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

interface Lessons {
    day: number,
    duration: number,
    location: string,
    startTime: string,
    subject: string,
    teachers: string,
    group: string
}

export async function getLessonsByID(rootURL: string, id: string){
    const fullURL = rootURL + API_MAP.lessons.path + "id=" + id
    let res = await getData(fullURL)
    .then((rawJson: Lessons[]|null) => {
        if (rawJson == null){
            if(DEVELOPER_MODE)
                console.log('[getLessonsByID]: unable to fetch from', fullURL)
            return []
        }

        let parsed:EventData[] = []

        for(let lesson of rawJson){
            let id = generateID(parsed) || -1
            let startTime = lesson.startTime.split(':').map((v, i)=> parseInt(v))
            let endTime = [startTime[0] + lesson.duration - 1, 45]
            let location = lesson.location == '-' ? '' : lesson.location
            parsed.push({
                id,
                title: lesson.subject,
                shortTitle: formatEventTitle(lesson.subject),
                location,
                teacher: lesson.teachers,
                day: DAYS[lesson.day],
                startTime,
                endTime,
                group: lesson.group
            })
        }

        return parsed
    })
    .catch((err) => {
        console.log("[getLessonsByID]:",err)
        return []
    })
    return res
}