import { View, Text, StyleSheet } from 'react-native'
import { EventColors, EventColorsType } from '@/constants/EventColors'
import { loadData, storeData } from '../utils/localStorage'
import { useState, useEffect } from 'react'
import { EventData } from '../constants/EventTypes'

interface EventBlockProps extends React.ComponentProps<typeof View> {
    data: EventData
}

const days = [ 'MON', 'TUE', 'WED', 'THU', "FRI", 'SAT', 'SUN']

const findDimensions = (data: EventData) => {
    let res = {
        top: '0%',
        left: '0%',
        height: '0%'
    }

    // Left position
    let day = days.findIndex( (d) => d.toUpperCase() === data.day);
    if( day == -1){
        console.error("[findDimensions]: Invalid 'day' paramater -> " + data.day)
    }else{
        res.left = `${ (day*20) }%`
    }

    // normalising time
    let start = (data.startTime[0] - 8) + (data.startTime[1]/60)
    let end = (data.endTime[0] - 8) + (data.endTime[1]/60);

    // Top position
    if(start < 0)
        console.error("[findDimensions]: Invalid 'startTime' paramater -> " + data.startTime)
    if(end > 13)
        console.error("[findDimensions]: Invalid 'endTime' paramater -> " + data.endTime)

    res.top = `${100/13*start}%`

    // Height
    if(start >= end){
        console.error("[findDimensions]: Invalid 'startTime' and 'endTime' paramater -> " + data.startTime + " " + data.endTime)
        let tmp = start;
        start = end;
        end = tmp;
    }
    res.height = `${100/13*(end-start)}%`;

    return StyleSheet.flatten(res)

}

export function formatTitle(title: string) {
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

const ThemeMap = new Map<string, EventColorsType>();
const getTheme = (location: string) => {
    if(!ThemeMap.has(location)){
        const index = ThemeMap.size % EventColors.length
        ThemeMap.set(location, EventColors[index])
    }
    return ThemeMap.get(location)! // ! is so that null is not returned
}

export default function EventBlock(props: EventBlockProps){
    const [theme, setTheme] = useState<EventColorsType>(EventColors[0])


    const loadThemeMap = async (map: Map<any, any>) => {
        const storedMap = await loadData('ThemeMap')
        if(!storedMap) return // not stored

        JSON.parse(storedMap).forEach((entry: [any, any], _: number) => {
            map.set(entry[0], entry[1])
        });        
    }

    useEffect(() => {
        loadThemeMap(ThemeMap)
        setTheme( getTheme(props.data.location) )
        storeData('ThemeMap', JSON.stringify([...ThemeMap]))
      }, []);

    return (
        <>
        <View style={ StyleSheet.flatten([ 
            styles.event, 
            findDimensions(props.data), 
            {backgroundColor: theme.background, borderColor: theme.border}
            ]) }>
                <Text style={{color: theme.text}}>{formatTitle(props.data.title)}</Text>
                <Text style={{fontSize: 10, color: theme.text, opacity: 0.5}}>{props.data.location}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    event: {
        backgroundColor: 'coral',   //default
        textAlignVertical: 'center',

        width: '20%',
        position: 'absolute',

        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#FFFFFF01' //default
    }
})