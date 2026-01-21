import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadData } from "./localStorage";
import pako from 'pako';
import { DAYS, EventData } from "@/constants/EventTypes";
import { EventColorsType } from "@/constants/EventColors";
import { generateID } from "./eventTools";

function HexColourToB94(hex:string):string {
    hex = hex.substring(1)
    const b = new Uint8Array([
        parseInt(hex.slice(0,2), 16),
        parseInt(hex.slice(2,4), 16),
        parseInt(hex.slice(4,6), 16)
    ]);

    return encodeB94(b);
}

function B94ToHexColour(cmp:string):string {
    let bytes = decodeB94(cmp);
    
    return '#' + Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
}

function bitPackTime(startTime: number[], endTime: number[], day:string){
    // xDDD_SSSS-SSSS_SSOO-OOOO_OOOO
    //  DAY ^--START---^^--OFFSET--^

    let start = startTime[0] * 60 + startTime[1] - 480
    let end = endTime[0] * 60 + endTime[1] - 480
    let duration = end-start
    let dayInd = DAYS.indexOf(day)

    let packed_day = (dayInd << 20) | (start << 10) | duration
    let packed_bytes = new Uint8Array(3);

    packed_bytes[0] = (packed_day >> 16) & 0xff;
    packed_bytes[1] = (packed_day >> 8) & 0xff;
    packed_bytes[2] = packed_day & 0xff;

    return encodeB94(packed_bytes)
}

function bitUnpackTime(encoded:string) {
    // xDDD_SSSS-SSSS_SSOO-OOOO_OOOO
    //  DAY ^--START---^^--OFFSET--^
    let data = decodeB94(encoded);

    const dayInd = (data[0] >> 4) ^ 7
    const start =  (data[0] ^ 0x0f << 6) + (data[1] >> 2) + 480
    const offset = (data[1] ^ 3 << 8) + data[2]
    const end = start + offset;

    const startTime = [ Math.floor(start/60), start % 60 ];
    const endTime =   [ Math.floor(  end/60),   end % 60 ];
    const day = DAYS[dayInd];

    return {startTime, endTime, day};
}

function minifyJSON(obj: Record<string, any>) {
    let lessons:any[] = []
    let colours:string[][] = []

    for(let key of Object.keys(obj)){
        if(key == "ThemeMap"){
            for(let [loc, col] of obj[key]) {
                colours.push([
                    loc, 
                    HexColourToB94(col["background"]), 
                    HexColourToB94(col["text"])
                ]);
            }
            continue;
        }

        if(key == "eventData"){
            for (let lesson of obj[key]){
                let enc_day = bitPackTime(lesson["startTime"], lesson["endTime"], lesson["day"])

                let lsn = [
                    enc_day,
                    lesson["location"],
                    lesson["shortTitle"],
                    lesson["teacher"],
                    lesson["title"]
                ]; 

                if(lesson["group"].length != 0)
                    lsn.push(lesson["group"])

                lessons.push(lsn);
            }
            continue;
        }

        // uncaught keys 
        // res[key] = obj[key]
    }

    return [lessons, colours]
}

function maxifyJSON(obj: any[]) {
    const [lessons, colors] = obj

    let res:Record<string, any> = {}

    // theme rebuilding
    let themeMap = new Map<string, EventColorsType>()
    for(let [loc, bg, txt] of colors) {
        themeMap.set(loc, {background: bg, text: txt, border: '#00000001' })
    }
    res['ThemeMap'] = [...themeMap]

    // lesons rebuilding
    let uncompressedLessons: EventData[] = []
    for(let lsn of lessons) {
        // [enc_time, location, shortTitle, teacher, title, group?]
        let time = bitUnpackTime(lsn[0]);
        let [location, shortTitle, teacher, title] = lsn.slice(1, 5)
        let group = lsn.length > 5 ? lsn[5] : ""

        let id = generateID(uncompressedLessons) || -1;
        uncompressedLessons.push({
            ...time,
            id,
            location, 
            shortTitle, 
            teacher, 
            title,
            group
        });
    }
    res['eventData'] = uncompressedLessons

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
                        console.log("[getCompressedData]:", key)
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


export function decompressData(bytes:Uint8Array ){

    for (let trim = 0; trim < 4; trim++) {
        try {
            const arr = trim === 0 ? bytes : bytes.slice(0, bytes.length - trim);
            let unzipped = pako.inflate(arr);
            let miniJson =  new TextDecoder().decode(unzipped)
            return JSON.stringify(maxifyJSON(JSON.parse(miniJson)))
        } catch (e) {
            if (trim === 3) throw e;
        }
    }

}

//// B94 ENCODING ////

const ASCII_START = 33
const ASCII_RANGE = 94  // 126 - 33 + 1

export function encodeB94(bytes: Uint8Array){
    if(bytes.length == 0)
        return "";
    
    let result = '';
    let value = 0;
    let bitCount = 0;

    for (let i = 0; i < bytes.length; i++) {
        value = (value << 8) | bytes[i];
        bitCount += 8;

        while (bitCount >= 6) {
            bitCount -= 6;
            const index = (value >> bitCount) & 0x3F;
            result += String.fromCharCode(ASCII_START + index);
        }
    }

    if (bitCount > 0) {
        const index = (value << (6 - bitCount)) & 0x3F;
        result += String.fromCharCode(ASCII_START + index);
    }

    return result;
}

export function decodeB94(data:string): Uint8Array {
    if (data.length === 0)
        return new Uint8Array(0);
    
    const bytes: number[] = [];
    let value = 0;
    let bitCount = 0;

    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i);
        const index = charCode - ASCII_START;
        
        if (index < 0 || index >= ASCII_RANGE) {
            throw new Error(`Invalid character in B94 string: ${data[i]}`);
        }
        
        value = (value << 6) | index;
        bitCount += 6;

        while (bitCount >= 8) {
            bitCount -= 8;
            bytes.push((value >> bitCount) & 0xFF);
        }
    }

    // Handle remaining bits (should be less than 8)
    if (bitCount > 0) {
        bytes.push((value << (8 - bitCount)) & 0xFF);
    }

    return new Uint8Array(bytes);
}