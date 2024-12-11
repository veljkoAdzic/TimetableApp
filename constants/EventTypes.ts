export interface EventData {
    title: string,
    day: string,
    startTime: number[],
    endTime: number[],
    location: string,
    extra_descriptions?: string[]
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI']