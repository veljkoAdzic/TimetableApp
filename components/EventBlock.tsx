import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { EventColors, EventColorsType } from '@/constants/EventColors'
import { loadData, storeData } from '../utils/localStorage'
import { formatEventTitle, loadThemeMap } from '@/utils/eventTools'
import { useState, useEffect } from 'react'
import { EventData } from '../constants/EventTypes'

interface EventBlockProps extends React.ComponentProps<typeof View> {
    data: EventData,
    theme?: EventColorsType
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



export default function EventBlock(props: EventBlockProps){
    const [theme, setTheme] = useState<EventColorsType>(EventColors[0])


    

    useEffect(() => {
        if(props.theme){
            setTheme(props.theme)
        }

        // loadThemeMap(ThemeMap).then(() => {
        //     setTheme( getTheme(props.data.location) )
        // })
        // storeData('ThemeMap', JSON.stringify([...ThemeMap]))
        if(!props.data.shortTitle){
            props.data.shortTitle = formatEventTitle(props.data.title)
        }
        
      }, []);

    return (
        <>
        <View style={ StyleSheet.flatten([ 
            styles.event, 
            findDimensions(props.data), 
            {backgroundColor: theme.background, borderColor: theme.border}
            ]) }>
                <Text style={{color: theme.text}}>{props.data.shortTitle}</Text>
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