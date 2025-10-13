import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadData } from "./localStorage";
import pako from 'pako';
import { DAYS, EventData } from "@/constants/EventTypes";
import { EventColorsType } from "@/constants/EventColors";
import { generateID } from "./eventTools";

function minifyJSON(obj: any) {
    let lessons = []
    let colours:any = {}
    let res:any = {}

    for(let key of Object.keys(obj)){
        if(key == "ThemeMap"){
            for(let [loc, col] of obj[key]) {
                colours[loc] = {"b": col["background"], "t": col["text"]}
            }
            continue;
        }

        if(key == "eventData"){
            for (let lesson of obj[key]){
                let b = lesson["startTime"][0] * 100 + lesson["startTime"][1]
                let e = lesson["endTime"][0] * 100 + lesson["endTime"][1]
                let d = DAYS.indexOf(lesson["day"])

                lessons.push({
                    d, e, b,
                    l: lesson["location"],
                    s: lesson["shortTitle"],
                    p: lesson["teacher"],
                    t: lesson["title"],
                    g: lesson["group"]
                })
            }
            continue;
        }

        // uncaught keys
        res[key] = obj[key]
    }

    res["l"] = lessons
    res["c"] = colours

    return res
}

function maxifyJSON(obj: any) {
    const KEYS = Object.keys(obj)
    KEYS.includes('c')
    if(!KEYS.includes('c') || !KEYS.includes('l')){
        throw new Error("Invalid JSON; Must include " + `${ KEYS.includes('c') ? "c" : "l" }` )
    }

    let res:Record<string, any> = {}

    for(let key of Object.keys(obj)){
        if(key == 'c'){
            const tmp: Record<string,{b: string, t: string}> = obj[key]
            let themeMap = new Map<string, EventColorsType>()
            for(let [loc, col] of Object.entries(tmp) ) {
                themeMap.set(loc, {background: col.b, text: col.t, border: '#00000001' })
            }
            res['ThemeMap'] = [...themeMap]
            continue;
        }

        if(key == 'l'){
            let uncompressedLessons: EventData[] = []

            const lessonsArr: {d: number, e: number, b: number, l: string, s: string, p:string, t:string, g: string}[] = obj[key]
            for (let les of lessonsArr){
                let startTime = [Math.floor(les.b/100), les.b%100]
                let endTime = [Math.floor(les.e/100), les.e%100]
                let day = DAYS[les.d]
                let id = generateID(uncompressedLessons) || -1;

                uncompressedLessons.push({
                    id,
                    startTime,
                    endTime,
                    day,
                    location: les.l,
                    shortTitle: les.s,
                    teacher: les.p, 
                    title: les.t, 
                    group: les.g 
                })
            }

            res['eventData'] = uncompressedLessons
            continue;
        }

        // fallback
        res[key] = obj[key]
    }

    return res
}

const Z85_ALPHABET = '0123456789abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*>&<>()[]{}@%$#'

export function encodeZ85(bytes: Uint8Array<ArrayBuffer>) {
    let res = ""

    let len = bytes.length + ((4 - (bytes.length % 4)) % 4)

    for( let i = 0; i < bytes.length; i+=4){
        const val = 
        ( bytes[i+0] as number) << 24   | 
        ((bytes[i+1] as number) << 16 ) |
        ((bytes[i+2] as number) <<  8 ) |
        ((bytes[i+3] as number)>>>  0 );

        let v = val >>> 0;
        const block = new Array(5)
        for(let j = 4; j >= 0; j--) {
            const index = v % 85;
            block[j] = Z85_ALPHABET[index]
            v = Math.floor( v / 85)
        }

        res += block.join('')
    }

    return res
}


export async function getCompressedData(){
    return await AsyncStorage.getAllKeys()
    .then(async (keys) => {
        let data:any = {}

        const tmp = async () => {
            for(let key of keys){
                await loadData(key)
                .then((val) => {
                    if(val == null || val == undefined) 
                        data[key] = null
                    else{
                        data[key] = JSON.parse(val) || null
                    }
                })
            }
        }

        return await tmp().then(() => {return data})

    })
    .then((data) => {
        return pako.deflate( JSON.stringify( minifyJSON(data) ) )
    })

}




