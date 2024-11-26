import { View, Text, StyleSheet } from 'react-native'

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

const colours = [ '#faca50', '#3067e6', '#32b82e', '#9e2220']
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

export default function EventBlock(props: EventBlockProps){
    return (
        
        <>
        <View style={StyleSheet.flatten([ styles.event, findDimensions(props.data)])}>
                <Text>{props.data.title}</Text>
                <Text>{props.data.location}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    event: {
        backgroundColor: 'rgb(220, 180, 50)',
        textAlignVertical: 'center',

        width: '20%',
        position: 'absolute',

        borderRadius: 5
    }
})