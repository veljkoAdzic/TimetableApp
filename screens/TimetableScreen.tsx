import { View, Text, StyleSheet } from 'react-native'
import  Grid  from '@/components/Grid'
import { useEffect } from 'react'
//import AsyncStorage from '@react-native-async-storage/async-storage'
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
        title: "Kompjuterski Mrezi i Bezbednost",
        day: 'MON',
        startTime: [11, 0],
        endTime: [12, 45],
        location: "AMF PED",
        extra_descriptions: ["Prof b"]
    },
    {
        title: "Digitizacija A",
        day: 'MON',
        startTime: [14, 0],
        endTime: [15, 30],
        location: "2",
        extra_descriptions: ["labs"]
    },

    {
        title: "Algoritmi i Podatocni Strukturi",
        day: 'MON',
        startTime: [15, 30],
        endTime: [17, 0],
        location: "215",
        extra_descriptions: ["labs"]
    },

    {
        title: "Matematika 3 A",
        day: 'MON',
        startTime: [18, 30],
        endTime: [20, 0],
        location: "2",
        extra_descriptions: ["labs"]
    },

    {
        title: "Kompjuterski Mrezi i Bezbednost",
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
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [10, 0],
        endTime: [11, 45],
        location: "223",
        extra_descriptions: ["Prof c"]
    },

    {
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [12, 0],
        endTime: [12, 45],
        location: "223",
        extra_descriptions: ["Asis b"]
    },

    {
        title: "Digitizacija",
        day: 'FRI',
        startTime: [12, 0],
        endTime: [13, 45],
        location: "FINKI AMF G",
        extra_descriptions: ["Asis b"]
    },
    {
        title: "Digitizacija",
        day: 'FRI',
        startTime: [14, 0],
        endTime: [15, 45],
        location: "FINKI AMF G",
        extra_descriptions: ["Prof c"]
    },
    {
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [12, 30],
        endTime: [14, 0],
        location: "138",
        extra_descriptions: ["labs"]
    },
    {
        title: "Kompjuterski Mrezi i Bezbednost",
        day: 'THU',
        startTime: [14, 0],
        endTime: [15, 45],
        location: "AMF PED",
        extra_descriptions: ["asis d"]
    },
    {
        title: "Algoritmi i Podatocni Strukturi",
        day: 'THU',
        startTime: [16, 0],
        endTime: [17, 45],
        location: "AMF PED",
        extra_descriptions: ["prof d"]
    },
    {
        title: "Algoritmi i Podatocni Strukturi",
        day: 'THU',
        startTime: [18, 0],
        endTime: [19, 45],
        location: "AMF PED",
        extra_descriptions: ["asis d"]
    },
]

function SideBar(){
    return(
        <View>
            { Array.from({length: 13}).map( (_, index) => (
                <View key={index} style={styles.timeSlots}>
                    <Text style={styles.timedisplay}> { ` ${(index < 2)?'0':''}${index+8}` }:00</Text>
                </View>
            )
            )}
        </View>
    )
}

export default function TimetableScreen(props: any){
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
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sideBar: {
        backgroundColor: '#FF8012',
        width: 80
    },
    timeSlots: {
        height: `${100/13}%`,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#8883'
    },
    timedisplay: {
        fontSize: 10,
        paddingRight: 2,
        color: '#AAA' 
    },

    gridContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch'
    }

})
