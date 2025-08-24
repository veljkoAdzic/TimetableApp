// TODO: change start and end time to Time class!
export interface EventData {
    title: string,
    day: string,
    startTime: number[],
    endTime: number[],
    location: string,
    extra_descriptions?: string[],
    teacher: string,
    group: string,

    shortTitle?: string,
    id: number
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI']

export const DefaultEventData: EventData = 
        {
            id: -1,
            title: "",
            shortTitle: '',
            location: '',
            teacher: '',
            startTime: [8, 0],
            endTime: [8, 45],
            day: "MON",
            group: ''
        }