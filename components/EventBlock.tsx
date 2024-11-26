import { View, Text, StyleSheet } from 'react-native'
import { EventColors } from '@/constants/EventColors'


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

    let theme = getColorTheme(props.data.location)

    return (
        
        <>
        <View style={ StyleSheet.flatten([ 
            styles.event, 
            findDimensions(props.data), 
            {backgroundColor: theme.background, borderColor: theme.border}
            ]) }>
                <Text style={{color: theme.text}}>{props.data.title}</Text>
                <Text style={{fontSize: 10, color: (theme.text + 'AF')}}>{props.data.location}</Text>
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
        borderWidth: 2,
        borderColor: '#FFFFFF01' //default
    }
})