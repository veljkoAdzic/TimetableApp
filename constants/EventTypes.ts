export interface EventData {
    title: string,
    day: string,
    startTime: number[],
    endTime: number[],
    location: string,
    extra_descriptions?: string[],

    shortTitle?: string,
    id: number
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI']

