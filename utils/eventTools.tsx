import { DEVELOPER_MODE } from "@/constants/Settings"
import { EventData } from "@/constants/EventTypes"
import { loadData } from "./localStorage"

export function formatEventTitle(title: string) {
    title.trim()
    const maxLen = 8

    //can fit as is
    if (title.length <= maxLen)
        return title

    let endMark = title.match(/\(.+\)$/u)
    
    if(endMark)
        title = title.replace(endMark[0], "").trim()
    
    const fragments = title.match(/\S+/gu) || []
    let res = ""

    if (fragments.length <= 2) {
        res = fragments.map( (fr, _) => fr.substring(0, 3) ).join(" ").trim()

        if(endMark)
            res = res + " " + endMark[0]

        if (res.length <= maxLen)
            return res
    }

    res = ""
    fragments.forEach((f, _) => {
        res += f.charAt(0)
    })
    res.trim()

    if(endMark)
        res = res + " " + endMark[0]

    return res
}

export const loadThemeMap = async (map: Map<any, any>) => {
        const storedMap = await loadData('ThemeMap')
        if(!storedMap) return // not stored

        if(DEVELOPER_MODE)
            console.log("[loadThemeMap]: loaded!")
        
        JSON.parse(storedMap).forEach((entry: [any, any], _: number) => {
            map.set(entry[0], entry[1])
        });        
    }

export function generateID(existing: EventData[]){
    const MOD = Math.max(existing.length, 5) * 2
    let i = 1
    while (i < MOD + 1) { 
        if ( existing.filter((event) => {return event.id == i}).length == 0 )
            return i
        i++
    }
}