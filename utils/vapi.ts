const NOW_DATE = new Date()
const weekday = (NOW_DATE.getDay() + 6) % 7;

const getTTViewDataURL = "https://finki.edupage.org/timetable/server/ttviewer.js?__func=getTTViewerData"
const getTTViewDataPayload  = {"__args": [null, NOW_DATE.getFullYear()],"__gsh": "00000000"}

const DATEFROM_date = new Date(NOW_DATE);
DATEFROM_date.setDate(NOW_DATE.getDate() - weekday)

const DATETO_date = new Date(DATEFROM_date);
DATETO_date.setDate(DATEFROM_date.getDate() + 6);

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DATEFROM = formatDate(DATEFROM_date);
const DATETO = formatDate(DATETO_date);

const mainDBAccessorURL = "https://finki.edupage.org/rpr/server/maindbi.js?__func=mainDBIAccessor"
const mainDBAccessorPayload = {"__args": [null,2025,{"vt_filter": {"datefrom": DATEFROM, "dateto": DATETO}},{"op": "fetch","needed_part": {"teachers": ["short","name","firstname","lastname","callname","subname","code","cb_hidden","expired"],"classes": ["short","name","firstname","lastname","callname","subname","code","classroomid"],"classrooms": ["short","name","firstname","lastname","callname","subname","code"],"igroups": ["short","name","firstname","lastname","callname","subname","code"],"students": ["short","name","firstname","lastname","callname","subname","code","classid"],"subjects": ["short","name","firstname","lastname","callname","subname","code"],"events": ["typ","name"],"event_types": ["name","icon"],"subst_absents": ["date","absent_typeid","groupname"],"periods": ["short","name","firstname","lastname","callname","subname","code","period","starttime","endtime"],"dayparts": ["starttime","endtime"],"dates": ["tt_num","tt_day"]},"needed_combos": {}}],"__gsh": "00000000"}

const regularGetDataURL = "https://finki.edupage.org/timetable/server/regulartt.js?__func=regularttGetData"
const regularGetDataPayload = {"__args": [null,"26"],"__gsh": "00000000"}


const reqHeaders = {
    "Content-Type": "application/json",
    "Referer": "https://finki.edupage.org/",
}

type timetableMetadata = {
    tt_num: string,
    year: number,
    text: string,
    datefrom: string,
    hidden: boolean
}

type ClassRow = {
  id: string;
  name: string;
  short: string;
};

type SubjectRow = {
  id: string;
  name: string;
};

type TeacherRow = {
  id: string;
  short: string;
};

type PeriodRow = {
  id: string;
  starttime: string;
};

type ClassroomRow = {
  id: string;
  short: string;
};

type LessonRow = {
  id: string;
  groupnames: string[] | string ;
  durationperiods: number;
  subjectid: string;
  classids: string[],
  teacherids: string[]
};

type CardRow = {
  id: string;
  days: string[] | number;
  period: string;
  lessonid: string;
  classroomids: string[];
};

type RawTable =
    | { id: "classes"; data_rows: ClassRow[] }
    | { id: "subjects"; data_rows: SubjectRow[] }
    | { id: "teachers"; data_rows: TeacherRow[] }
    | { id: "periods"; data_rows: PeriodRow[] }
    | { id: "classrooms"; data_rows: ClassroomRow[] }
    | { id: "lessons"; data_rows: LessonRow[] }
    | { id: "cards"; data_rows: CardRow[] }
    | { id: string; data_rows: any[] }; // fallback

type EdupageResponse = {
    r: {
        dbiAccessorRes: {
            tables: RawTable[];
            [key: string]: unknown; // unused
        };
    [key: string]: unknown; // unused
    };

    [key: string]: unknown; // unused
}

type TableId =
    | "classes"
    | "subjects"
    | "teachers"
    | "periods"
    | "classrooms"
    | "lessons"
    | "cards";


export async function getRawJson(){
    await fetch("https://finki.edupage.org/timetable/", {
        method: "GET",
        credentials: "include",
    });

    const gtvdRes = await fetch(getTTViewDataURL, {
        method: "POST",
        headers: reqHeaders,
        credentials: "include",
        body: JSON.stringify(getTTViewDataPayload)
    })

    const gtvd = await gtvdRes.json();
    const timetables:timetableMetadata[] = gtvd.r.regular.timetables.filter( (a:timetableMetadata) => !a.hidden);
    const default_num = timetables
    .sort((a, b) => b.tt_num.localeCompare(a.tt_num))
    .sort((a, b) => b.datefrom.localeCompare(a.datefrom))
    [0].tt_num


    // 3
    regularGetDataPayload.__args[1] = default_num;

    const rgdRes = await fetch(regularGetDataURL, {
        method: "POST",
        headers: reqHeaders,
        credentials: "include",
        body: JSON.stringify(regularGetDataPayload),
    });

    const rgd = await rgdRes.json();

    // 5
    await fetch(mainDBAccessorURL, {
        method: "POST",
        headers: reqHeaders,
        credentials: "include",
        body: JSON.stringify(mainDBAccessorPayload),
    });

    return rgd as EdupageResponse;
}

export type EdupageLookup = {
    classes?: Record<string, ClassRow>;
    subjects?: Record<string, SubjectRow>;
    teachers?: Record<string, TeacherRow>;
    periods?: Record<string, PeriodRow>;
    classrooms?: Record<string, ClassroomRow>;
    lessons?: Record<string, LessonRow>;
    cards?: Record<string, CardRow>;
};

export function parseJsonBlob(blob: EdupageResponse) {
  const res:EdupageLookup = {};

  for (const table of blob.r.dbiAccessorRes.tables) {
    const tableId = table.id as TableId;

    // Skip unused tables
    if (![
      "classes",
      "subjects",
      "teachers",
      "periods",
      "classrooms",
      "lessons",
      "cards",
    ].includes(tableId)) {
      continue;
    }

    const entries: Record<string, any> = {};

    for (const row of table.data_rows as any[]) {
      // LESSONS
      if (tableId === "lessons") {
        let groupnames: string[] = row.groupnames ?? [];
        groupnames = groupnames.filter((g) => g.length !== 0);
        row.groupnames = groupnames.join("/");
      }

      // CARDS
      if (tableId === "cards") {
        if (!row.days || row.days.length === 0) continue;
        row.days = row.days.indexOf("1");
      }

      // CLASSES
      if (tableId === "classes") {
        row.name = row.name.trim();
        row.short = row.short.trim();
      }

      entries[row.id] = row;
    }

    (res as any)[tableId] = entries;
  }

  return res;
}

function __parseJsonBlob(blob:EdupageResponse) {
    const res: EdupageLookup = {};

    for(let table of blob.r.dbiAccessorRes.tables){

        const entries:Record<string, any> = {}

        for (let row of table.data_rows){
            switch (table.id){
                case "lessons":
                    let groupnames = row.groupnames as string[] ?? []
                    groupnames = groupnames.filter((a) => a.length > 0)
                    row.groupnames = groupnames.join("/")
                break;

                case "cards":
                    if (!row.days || row.days.length == 0) continue;
                    row.days = row.days.indexOf("1");
                break;

                case "classes":
                    row.name = row.name.trim()
                    row.short = row.short.trim()
                break;

                default:
                    if( ![
                        "classes",
                        "subjects",
                        "teachers",
                        "periods",
                        "classrooms",
                        "lessons",
                        "cards"
                        ].includes(row.id)
                    )
                        continue;
                break;
            }

            entries[row.id] = row
        }

        res[table.id as TableId] = entries
    }

    return res
}

