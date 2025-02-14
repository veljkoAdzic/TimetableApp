import { DEVELOPER_MODE } from "@/constants/Settings"
import { loadData } from "./localStorage"

export function formatEventTitle(title: string) {
    title.trim()
    const maxLen = 9
    if (title.length <= maxLen) //can fit as is
        return title
    const fragments = title.split(/\W/)
    let res = ""

    if (fragments.length <= 3) {
        fragments.forEach((f, _) => {
            res += f.substring(0, 3) + " "
        })

        res.trimEnd()

        if (res.length <= maxLen)
            return res
    }

    res = ""
    fragments.forEach((f, _) => {
        res += f.charAt(0)
    })

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