export default class Time {
    public hours: number
    public minutes: number

    constructor(arr: number[])
    constructor(date: Date)
    constructor(hours: number, minutes: number)

    constructor( a: number[] | Date | number, min?:number ){
        this.hours = 0
        this.minutes = 0

        if(Array.isArray(a)){
            if (a.length < 2) return;
            this.hours = a[0]
            this.minutes = a[1]
        } else if(a instanceof Date){
            this.hours = a.getHours()
            this.minutes = a.getMinutes()
        } else {
            this.hours = a;
            this.minutes = min || 0;
        }

        this.equate()   
    }

    private equate() {
        this.hours += Math.floor(this.minutes/60)
        this.hours %= 24
        this.minutes %= 60
    }

    public toString() {
        return String(this.hours).padStart(2, '0') + ":" + String(this.minutes).padStart(2, '0')
    }
    
    public toDate() {
        let d = new Date()
        d.setHours(this.hours)
        d.setMinutes(this.minutes)
        return d
    }
}