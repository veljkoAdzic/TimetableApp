import { View, Text, StyleSheet } from 'react-native'
import { EventColors, EventColorsType } from '@/constants/EventColors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'

interface EventData {
        title: string,
        day: string,
        startTime: number[],
        endTime: number[],
        location: string,
        extra_descriptions?: string[]
    
}
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
    let day = days.findIndex( (d) => d === data.day);
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

const getColorTheme = (location: string) => {

    let hash = 0;
    for(let i = 0; i < location.length; i++)
        hash += location.charCodeAt(i)

    hash = hash % EventColors.length;

    return EventColors[hash]

}

export default function EventBlock(props: EventBlockProps){
    const [theme, setTheme] = useState<EventColorsType>(EventColors[0])

    const storeData = async (key: string, value: number) => {
        try{
            await AsyncStorage.setItem(key, `${value}`)
        } catch (err){
            alert(err)
        }
    }

    const loadData = async (key: string) => {
        try{
            const value = await AsyncStorage.getItem(key)
            return value
        }catch (err){
            alert(err)
            return null
        }
    }

    const initializeColor = async () => {
        const index = await loadData(props.data.location)

        console.log(props.data.location + " | " + index) // test

        if(index){
            console.log(`used colour! ${index}`) // test
            const i = parseInt(index)
            setTheme(EventColors[i])
        } else {
            const latest = await loadData('latest')
            const latestIndex = (latest) ? parseInt(latest) : -1
            const next = (latestIndex+1) % EventColors.length
            
            console.log(latest, latestIndex, next) // test

            await storeData(props.data.location, next)
            await storeData('latest', next)
            setTheme(EventColors[next])
        }
    }
    
    const debugStorage = async () => {
        const keys = await AsyncStorage.getAllKeys();
        const entries = await AsyncStorage.multiGet(keys);
        console.log('[AsyncStorage State]', Object.fromEntries(entries));
    };

    useEffect(() => {
        debugStorage();
        initializeColor();
      }, []);

    return (
        
        <>
        <View style={ StyleSheet.flatten([ 
            styles.event, 
            findDimensions(props.data), 
            {backgroundColor: theme.background, borderColor: theme.border}
            ]) }>
                <Text style={{color: theme.text}}>{props.data.title}</Text>
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