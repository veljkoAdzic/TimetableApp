import { loadData, storeData } from "./localStorage";
import { DAYS, EventData } from "@/constants/EventTypes";
import { API_MAP, DEVELOPER_MODE } from "@/constants/Settings";
import { formatEventTitle, generateID } from "./eventTools";
import { EdupageLookup, getRawJson, parseJsonBlob } from "./vapi";

export interface apiInteractable {
     getData: (url:string) => Promise<any>,
     getClassList: () =>Promise<{label:string; value:string;}[]>,
     getLessonsByID: (id:string) => Promise<EventData[]>,
     getLessonsByIDCache: Map<string, never[] | EventData[]>
}

export class HttpApiInteractor implements apiInteractable {
    rootURL:string;
    getLessonsByIDCache: Map<string, EventData[] | never[]>;

    constructor(root:string) {
       this.rootURL = root;
       this.getLessonsByIDCache = new Map<string, never[] | EventData[]>();
    }

    getData = async (url: string) => {
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
    
    getClassList = async () => {    
        const fullURL = this.rootURL + API_MAP.classList.path
        
        let res = await this.getData(fullURL)
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

            res.sort( (a, b) => a.label.trim().localeCompare(b.label.trim()) )
            
            return res
        })
        
        return res
    }

    
    getLessonsByID = async (id: string) => {
        const fullURL = this.rootURL + API_MAP.lessons.path + "id=" + id

        if (this.getLessonsByIDCache.has(fullURL)){
            if(DEVELOPER_MODE){
                console.log('[getLessonsByID]: Hit cache!')
            }

            return this.getLessonsByIDCache.get(fullURL)!
        }

        let res = await this.getData(fullURL)
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

        this.getLessonsByIDCache.set(fullURL, res)
        return res
    }
}

let cachedLookup:EdupageLookup|null = null;

export class VapiInteractor implements apiInteractable {
    getLessonsByIDCache: Map<string, EventData[] | never[]>;
    lookup: EdupageLookup;

    constructor(lookup:EdupageLookup){
        this.getLessonsByIDCache = new Map<string, never[] | EventData[]>();
        this.lookup = lookup;
    }

    static async create() {
        if(cachedLookup != null)
            return new VapiInteractor(cachedLookup)

        let tmp = async () => {
                return await getRawJson()
                .then(parseJsonBlob)
                .then(x => x)
            }
        
        cachedLookup = await tmp();

        return new VapiInteractor(cachedLookup)
    }

    getData = async (url: string) => new Promise<any>(()=> { throw "NO IMPLEMENTATION"});
    
    getClassList = async () => {
        let res:{label:string, value:string}[] = []
        
        if(!Object.hasOwn(this.lookup, "classes"))
            throw "[vapi:getClassList] No classes"

        for(let row of Object.values(this.lookup.classes!)){
            res.push({
                label: row.short,
                value: row.id
            })
        }

        res.sort( (a, b) => a.label.trim().localeCompare(b.label.trim()) )

        return res
    }
    getLessonsByID = async (id: string) => {
        if (this.getLessonsByIDCache.has(id)){
            if(DEVELOPER_MODE){
                console.log('[getLessonsByID]: Hit cache!')
            }

            return this.getLessonsByIDCache.get(id)!
        }

        const res:EventData[] = []

        const lessons = Object.values(this.lookup.lessons!).filter((l) => l.classids.includes(id))

        for (let lsn of lessons){
            try{
            const title = this.lookup.subjects![lsn.subjectid].name || ""

            let tchs:string[] = []
            for (let tid of lsn.teacherids){
                tchs.push(this.lookup.teachers![tid].short)
            }
            const teacher = tchs.join(", ")

            let card = Object.values(this.lookup.cards!).filter(c => c.lessonid == lsn.id)[0]

            const location = this.lookup.classrooms![card.classroomids[0]].short

            const period = this.lookup.periods![card.period].starttime

            const startTime = period.split(':').map((v, i)=> parseInt(v))
            const endTime = [startTime[0] + lsn.durationperiods -1, startTime[1] + 45]

            res.push({
                title,
                shortTitle: formatEventTitle(title),
                location,
                teacher,
                day: DAYS[card.days as number],
                startTime,
                endTime,
                group: lsn.groupnames as string,
                id: generateID(res) || parseInt(lsn.id) || -1
            })

            }
            catch {
                continue;
            }
        }

        this.getLessonsByIDCache.set(id, res)

        return res;
    }
}

export async function apiInteractorFactory(inputValue: string):Promise<apiInteractable> {

    if(inputValue.startsWith("vapi://")){
        return await VapiInteractor.create()
    }

    return new HttpApiInteractor(inputValue)
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

