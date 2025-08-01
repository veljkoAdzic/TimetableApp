import { DEVELOPER_MODE } from "@/constants/Settings"
import { EventData } from "@/constants/EventTypes"
import { loadData } from "./localStorage"

export function formatEventTitle(title: string) {
    title.trim()
    const maxLen = 9
    if (title.length <= maxLen) //can fit as is
        return title
    const fragments = title.match(/\S+/gu) || []
    let res = ""

    if (fragments.length <= 3) {
        res = fragments.map((fr, _) => fr.substring(0, 3)).join(" ")

        res.trim()

        if (res.length <= maxLen)
            return res
    }

    res = ""
    fragments.forEach((f, _) => {
        res += f.charAt(0)
    })

    return res.trim()
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
    const MOD = existing.length * 2
    
    let i = 0
    while (i < MOD) {
        let res = Math.floor(Math.random() * MOD) 
        if ( existing.filter((event) => {return event.id == res}).length == 0 )
            return res
    }
}