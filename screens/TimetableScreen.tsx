import { View, Text, StyleSheet } from 'react-native'
import  Grid  from '@/components/Grid'
import { useEffect, useState, useRef } from 'react'
import { loadData, storeData } from '@/utils/localStorage'
import { EventData } from '@/constants/EventTypes'
import { DEVELOPER_MODE } from '@/constants/Settings'
import { useLocalSearchParams } from 'expo-router'
import { formatEventTitle } from '@/utils/eventTools'

function SideBar(){
    return(
        <View>
            { Array.from({length: 13}).map( (_, index) => (
                <View key={index} style={styles.timeSlots}>
                    <Text style={[styles.timedisplay, index == 0 ? {borderTopWidth: 1, borderTopColor: '#8883'} : {}]}> { ` ${(index < 2)?'0':''}${index+8}` }:00</Text>
                </View>
            )
            )}
        </View>
    )
}



export default function TimetableScreen(props: {data?: EventData[], selected?: number[], setSelected?: (ids: number[]) => void}){
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [events_data, setEventData] = useState<EventData[] | null>(props.data || null)

    const {refresh} = useLocalSearchParams()
    const [reload, setReload] = useState(false)
    const handleRefresh = useRef<string | string[] | null>(null);

    useEffect(()=>{
        if(refresh && handleRefresh.current !== refresh){
            setReload(true)
            handleRefresh.current = refresh
        }
    },[refresh])

    useEffect(()=>{
        if(reload && props.data == null){
            setLoadingEvents(true)
            loadData('eventData')
            .then((res) => {
                if(DEVELOPER_MODE)
                    console.log("[TimetableScreen>useEffect([reload])]: Rerender")
                let data:EventData[] = (res) ? JSON.parse(res) : [];  
                for (let i =0; i < data.length; i++) {
                    if(data[i].shortTitle == undefined){
                        data[i].shortTitle = formatEventTitle(data[i].title)
                    }
                }
                setEventData(data)
                setLoadingEvents(false);
                setReload(false)
            })
        }
        if(reload){
            setReload(false)
            setLoadingEvents(false)
        }
    },[reload])
        
    useEffect(() =>{
        setLoadingEvents(true)
        if(events_data){
            const tmp = () => {
                let data = [...events_data]
                for (let i =0; i < data.length; i++) {
                    if(data[i].shortTitle == undefined){
                        data[i].shortTitle = formatEventTitle(data[i].title)
                    }
                }
                // await storeData('eventData', JSON.stringify(data))
                // if(DEVELOPER_MODE)
                //     console.log("[TimetableScreen>useEffect([])]: stored event data!")
            }

            if(events_data.length > 0)
                tmp();
            
            setLoadingEvents(false)
            return;
        }
        
        loadData('eventData')
        .then((res) => {
            if(DEVELOPER_MODE)
                console.log("[TimetableScreen>useEffect([])]: loaded event data!")
            let data = (res) ? JSON.parse(res) : [];  

            for (let i =0; i < data.length; i++) {
                if(data[i].shortTitle == undefined){
                    data[i].shortTitle = formatEventTitle(data[i].title)
                }
            }

            setEventData(data)
            setLoadingEvents(false);
        })
    }, [])

    useEffect(()=>{
        if(props.data && props.data.length > 0){
            setEventData(props.data)
            setReload(true)
        }
    },[props.data])

    if(loadingEvents){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.ttContainer}>
            <SideBar />
            <View style={styles.gridContainer}>
                <Grid events={events_data!} previewMode={(props.data != undefined)} selected={props.selected} setSelected={props.setSelected}/>
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
        borderColor: '#8883',
        boxSizing: 'border-box'
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
