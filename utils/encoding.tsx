import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadData } from "./localStorage";
import pako from 'pako';
import { DAYS, EventData } from "@/constants/EventTypes";
import { EventColorsType } from "@/constants/EventColors";
import { generateID } from "./eventTools";

type RGBBytes = Uint8Array;   // length = 3
type PackedTime = Uint8Array; // length = 3
type TimeTuple = number[] | [number, number];

type ThemeMapEntry = [string, EventColorsType];

type MaximisedJSON = {
    ThemeMap?: ThemeMapEntry[];
    eventData?: EventData[];
    [key: string]: unknown;
};

type MinifiedLessonBase = [
    PackedTime,
    string,
    string,
    string,
    string
];

type MinifiedLessonWithGroup = [
    PackedTime,
    string,
    string,
    string,
    string,
    string
];

type MinifiedLesson = MinifiedLessonBase | MinifiedLessonWithGroup;

type MinifiedColour = [
    string,
    RGBBytes,
    RGBBytes
];

type MinifiedJSON= [
    MinifiedLesson[],
    MinifiedColour[]
];

function HexColourToB94(hex:string):RGBBytes {
    hex = hex.substring(1)
    const b = new Uint8Array([
        parseInt(hex.slice(0,2), 16),
        parseInt(hex.slice(2,4), 16),
        parseInt(hex.slice(4,6), 16)
    ]);

    return b //encodeB94(b);
}

function B94ToHexColour(bytes:RGBBytes):string {
    // let bytes = decodeB94(cmp);
    
    return '#' + Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
}

function bitPackTime(startTime: TimeTuple, endTime: TimeTuple, day:string):PackedTime {
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

    return packed_bytes //encodeB94(packed_bytes)
}

function bitUnpackTime(data:PackedTime) {
    // xDDD_SSSS-SSSS_SSOO-OOOO_OOOO
    //  DAY ^--START---^^--OFFSET--^
    // const data = decodeB94(encoded);
    const packed_day = (data[0] << 16) | (data[1] << 8) | data[2];

    const dayInd = (packed_day >> 20) & 0x07
    const start =  ((packed_day >> 10) & 0x03ff) + 480
    const offset = (packed_day      ) & 0x03ff
    const end = start + offset;

    const startTime = [ Math.floor(start/60), start % 60 ];
    const endTime =   [ Math.floor(  end/60),   end % 60 ];
    const day = DAYS[dayInd];

    return {startTime, endTime, day};
}

function minifyJSON(obj: MaximisedJSON):MinifiedJSON {
    let lessons:MinifiedLesson[] = []
    let colours:MinifiedColour[] = []

    for(let key of Object.keys(obj)){
        if(key == "ThemeMap"){
            for(let [loc, col] of obj.ThemeMap!) {
                colours.push([
                    loc, 
                    HexColourToB94(col.background), 
                    HexColourToB94(col.text)
                ]);
            }
            continue;
        }

        if(key == "eventData"){
            for (let lesson of obj.eventData!){
                let enc_day = bitPackTime(lesson.startTime, lesson.endTime, lesson.day)

                let lsn:MinifiedLessonBase = [
                    enc_day,
                    lesson.location,
                    lesson.shortTitle || "",
                    lesson.teacher,
                    lesson.title
                ]; 

                if(lesson.group.length != 0)
                    lsn.push(lesson.group)

                lessons.push(lsn);
            }
            continue;
        }

        // uncaught keys 
        // res[key] = obj[key]
    }

    return [lessons, colours]
}

function maxifyJSON(obj: MinifiedJSON):MaximisedJSON {
    const [lessons, colors] = obj

    let res:MaximisedJSON = {}

    // theme rebuilding
    let themeMap = new Map<string, EventColorsType>()
    for(let [loc, bg, txt] of colors) {
        let background = B94ToHexColour(bg);
        let text = B94ToHexColour(txt);
        themeMap.set(loc, {background, text, border: '#00000001' })
    }
    res['ThemeMap'] = [...themeMap]

    // lesons rebuilding
    let uncompressedLessons: EventData[] = []
    for(let lsn of lessons) {
        // [enc_time, location, shortTitle, teacher, title, group?]
        let time = bitUnpackTime(lsn[0]);
        let [location, shortTitle, teacher, title] = [lsn[1], lsn[2], lsn[3], lsn[4]]
        let group = lsn.length > 5 ? lsn[5]! : ""

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

const NULL_STR = 0;
function serialize(data:MinifiedJSON){
    const strMem = new Map<string, number>();
    const strBank: number[] = [];
    const encoder = new TextEncoder();
    let strBankIndex = 1;

    function packString(s: string): number {
        if (strMem.has(s)) {
        return strMem.get(s)!;
        }

        const encoded = encoder.encode(s);
        if (encoded.length > 0xff) {
        throw new Error(`'${s}' too long`);
        }

        const index = strBankIndex;
        strBankIndex += 1;
        strMem.set(s, index);

        // append length and bytes to string bank
        strBank.push(encoded.length);
        for (let i = 0; i < encoded.length; i++) {
        strBank.push(encoded[i]);
        }

        return index;
    }
    const [events, colours]  = data

    const buff:number[] = []

    buff.push(Math.min(events.length , 255))
    buff.push(Math.min(colours.length, 255))

    for(let [loc, bg, txt] of colours){
        buff.push(packString(loc));
        buff.push(bg[0], bg[1], bg[2]);
        buff.push(txt[0], txt[1], txt[2]);
    }

    for(let lesson of events) {
        const dt = lesson[0];
        if (dt.length !== 3)
            throw new Error("DAY_TIME must be length 3");

        buff.push(dt[0], dt[1], dt[2]);
        
        for (let i = 1; i < 5; i++) 
          buff.push( packString(lesson[i] as string) );

        if(lesson.length > 5)
            buff.push(packString(lesson[5] as string))
        else 
            buff.push(NULL_STR)
    }

    // append string bank
    for (let i = 0; i < strBank.length; i++) 
        buff.push(strBank[i]);

    return [Uint8Array.from(buff), Uint8Array.from(strBank)];
}

function deserialize(buffer:Uint8Array):MinifiedJSON {
    const decoder = new TextDecoder();
    let offset = 0;

    const lessonLen = buffer[offset++];
    const colourLen = buffer[offset++];

    // unpack colours
    const coloursRaw:{loc:number, bg:RGBBytes, txt:RGBBytes}[] = []

    for (let i = 0; i < colourLen; i++) {
        const loc = buffer[offset++];

        const bg = buffer.slice(offset, offset+3);
        offset += 3;

        const txt = buffer.slice(offset, offset+3);
        offset += 3;

        coloursRaw.push({ loc, bg, txt });
    }

    // unpack lessons
    const lessonsRaw: {dt: PackedTime, strIndexes: number[]}[] = [];

    for(let i = 0; i < lessonLen; i++) {
        const dt = buffer.slice(offset, offset+3);
        offset += 3;

        const strIndexes = [
            buffer[offset++], // location
            buffer[offset++], // shortTitle
            buffer[offset++], // teacher
            buffer[offset++], // title
            buffer[offset++]  // group
        ];

        lessonsRaw.push({dt, strIndexes})
    }

    // Reading string bank
    const strBank = buffer.slice(offset);
    const strTable: string[] = [];

    let sbOffset = 0, strIndex = 0;

    while( sbOffset < strBank.length) {
        const len = strBank[sbOffset++];
        const strBytes = strBank.slice(sbOffset, sbOffset+len);

        sbOffset += len;

        strTable[strIndex++] = decoder.decode(strBytes);
    }

    function unpackString(index: number): string {
        if (index === NULL_STR) return "";
        return strTable[index-1];
    }

    // rebuilding JSON
    const lessons:MinifiedLesson[] = []
    const colours:MinifiedColour[] = []

    for(let {loc, bg, txt} of coloursRaw){
        colours.push([
            unpackString(loc),
            bg,
            txt
        ]);
    }

    for(let {dt, strIndexes} of lessonsRaw) {
        let unpacked = strIndexes.map(unpackString)
        let base:MinifiedLesson = [
           dt,
            unpackString(strIndexes[0]),
            unpackString(strIndexes[1]),
            unpackString(strIndexes[2]),
            unpackString(strIndexes[3]),
            unpackString(strIndexes[4])
        ];

        if(strIndexes[5] != NULL_STR)
            base.push(unpackString(strIndexes[5]))

        lessons.push(base)
    }

    return [lessons, colours]

}

export const SHARE_LINK_BASE = 'ttshare://tt.app/data#'

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
        const [serial, dict] = serialize(minifyJSON(data))
        // console.log(serial)
        return pako.deflate( serial, {level: 9}) 
    })

}


export function decompressData(bytes:Uint8Array ){
    let unzipped = pako.inflate(bytes); 
    // let miniJson =  new TextDecoder().decode(unzipped)
    // return JSON.stringify(maxifyJSON(JSON.parse(miniJson)))
    const des = deserialize(unzipped)
    // console.log(JSON.stringify( maxifyJSON( des ) ))
    return JSON.stringify( maxifyJSON( des ) )
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