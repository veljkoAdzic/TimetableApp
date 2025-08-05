import { View, SafeAreaView, Text, StyleSheet } from 'react-native'
import EventBlock from './EventBlock'
import { EventData } from '../constants/EventTypes'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { formatEventTitle, loadThemeMap } from '@/utils/eventTools'
import { useEffect, useState, useRef } from 'react'
import { storeData } from '@/utils/localStorage'
import { DEVELOPER_MODE } from '@/constants/Settings'
import { useLocalSearchParams } from 'expo-router'
const edngeCases = (i: number, j: number) => {
    let res = {
        borderTopWidth: 0,
        borderRightWidth: 0
    }
    if(i == 0)
        res.borderTopWidth = 1

    if(j == 4)
        res.borderRightWidth = 1

    return res
}

interface GridProps extends React.ComponentProps<typeof View> {
    events: EventData[],
    previewMode?: boolean 
}

const ThemeMap = new Map<string, EventColorsType>();

export default function Grid(props: GridProps){
    const [themeLoaded, setLoaded] = useState(false)

    const {refresh} = useLocalSearchParams()
    const [reload, setReload] = useState(false)
    const handleRefresh = useRef<string | string[] | null>(null);

    useEffect(()=>{
        if(refresh && handleRefresh.current !== refresh){
            setReload(true)
            handleRefresh.current = refresh
        }
    },[refresh])

    const loadData = () => {
        let modified = false;
        setLoaded(false);
        loadThemeMap(ThemeMap)
        .then(() => {
            if(props.previewMode || false) ThemeMap.clear()
                
            for(let e of props.events){
                if(e.location.length != 0 && !ThemeMap.has(e.location)){
                    modified = true;
                    if(DEVELOPER_MODE)
                        console.log('[Grid>useEffect([])]: Miss ' + e.location) // debugging
                    const index = ThemeMap.size % EventColors.length
                    ThemeMap.set(e.location, EventColors[index])
                }else if(DEVELOPER_MODE)
                    console.log('[Grid>useEffect([])]: Hit ' + e.location)
            }
            setLoaded(true);
            if(modified && !(props.previewMode || false))
            storeData('ThemeMap', JSON.stringify([...ThemeMap]))
            .then(() => {
                if(DEVELOPER_MODE)
                    console.log("[Grid>useEffect]: Stored " +
                        JSON.stringify([...ThemeMap]))  // debugging
            });
        })
        .then(() => {
            modified = false // reused flag
            for (let e of props.events) {
                if(!e.shortTitle){
                    e.shortTitle = formatEventTitle(e.title)
                    modified = true
                }
            }

            if (modified && !(props.previewMode || false)){
                // store the changes
                storeData('eventData', JSON.stringify(props.events))
            }
        })
    }

    useEffect(() =>{
        loadData()
    },[])

    useEffect(()=>{
        if(reload){
            loadData()
            setReload(false)
        }
    },[reload])

    useEffect(()=>{
            setReload(true)
    }, [props.events])
    
    if(!themeLoaded){
        return (
            <View>
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                { 
                // creating the grid
                Array.from({length: 13}).map( (_, i) => (  
                    <View key ={i} style={styles.rowContainer}>
                        {Array.from({length: 5}).map( (__, j) => (
                            <View key={i*5+j} style={[styles.block, edngeCases(i, j)]} />
                        ) )}
                    </View>
                ) )
                } 
            </View>

            {
            // Loading events
            props.events.map( (item, index) => (
                <EventBlock key={item.id} data={item} theme={ThemeMap.get(item.location)} />
            ) )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'stretch'
        
    },
    block: {        
        width: '20%',
        borderColor: '#8883',
        borderLeftWidth: 1,
        borderBottomWidth: 1
    }
})