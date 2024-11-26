import { View, Text, StyleSheet } from 'react-native'
import  Grid  from '@/components/Grid'

const events_data = [
    {
        title: "Matematika 3",
        day: 'MON',
        startTime: [8, 0],
        endTime: [10, 45],
        location: "AMF PED",
        extra_descriptions: ["Prof a"]
    },

    {
        title: "KMB",
        day: 'MON',
        startTime: [11, 0],
        endTime: [12, 45],
        location: "AMF PED",
        extra_descriptions: ["Prof b"]
    },
    {
        title: "Dig A",
        day: 'MON',
        startTime: [14, 0],
        endTime: [15, 30],
        location: "2",
        extra_descriptions: ["labs"]
    },

    {
        title: "APS",
        day: 'MON',
        startTime: [15, 30],
        endTime: [17, 0],
        location: "AMF PED",
        extra_descriptions: ["labs"]
    },

    {
        title: "Mat 3 A",
        day: 'MON',
        startTime: [18, 30],
        endTime: [20, 0],
        location: "2",
        extra_descriptions: ["labs"]
    },

    {
        title: "KMB",
        day: 'TUE',
        startTime: [15, 30],
        endTime: [17, 0],
        location: "215",
        extra_descriptions: ["labs"]
    },

    {
        title: "Matematika 3",
        day: 'TUE',
        startTime: [17, 0],
        endTime: [19, 45],
        location: "AMF PED",
        extra_descriptions: ["Asis a"]
    },

    {
        title: "IPKS",
        day: 'THU',
        startTime: [10, 0],
        endTime: [11, 45],
        location: "223",
        extra_descriptions: ["Prof c"]
    },

    {
        title: "IPKS",
        day: 'THU',
        startTime: [12, 0],
        endTime: [12, 45],
        location: "223",
        extra_descriptions: ["Asis b"]
    },
]

function SideBar(){
    return(
        <View>
            { Array.from({length: 13}).map( (_, index) => (
                <View key={index} style={styles.timeSlots}>
                    <Text style={{fontSize: 12}}> {index+8}:00</Text>
                </View>
            )
            )}
        </View>
    )
}

export default function TimetableDisplay(props: any){
    let numOfDays = 5

    return (
        <View style={styles.ttContainer}>
            <SideBar />
            <View style={styles.gridContainer}>
                <Grid events={events_data} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ttContainer:{
        flex: 1,
        flexDirection: 'row'
    },
    sideBar: {
        backgroundColor: '#FF8012',
        // flex: 1
        width: 80

    },
    timeSlots: {
        height: `${100/13}%`,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch'
    }

})
