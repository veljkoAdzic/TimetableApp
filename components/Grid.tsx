import { View, SafeAreaView, Text, StyleSheet } from 'react-native'
import EventBlock from './EventBlock'
import { EventData } from '../constants/EventTypes'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { loadThemeMap } from '@/utils/eventTools'
import { useEffect, useState } from 'react'
import { storeData } from '@/utils/localStorage'
import { DEVELOPER_MODE } from '@/constants/Settings'
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
    events: EventData[]
}

const ThemeMap = new Map<string, EventColorsType>();
// const getTheme = (location: string) => {
//     if(!ThemeMap.has(location)){
//         if(DEVELOPER_MODE)
//             console.log('[getTheme]: Miss ' + location) // debugging
//         const index = ThemeMap.size % EventColors.length
//         ThemeMap.set(location, EventColors[index])
//     }else if(DEVELOPER_MODE)
//         console.log('[getTheme]: Hit ' + location) // temp
//     return ThemeMap.get(location)! // ! is so that null is not returned
// }

export default function Grid(props: GridProps){
    const [themeLoaded, setLoaded] = useState(false)

    useEffect(() =>{
        let modified = false;
        setLoaded(false);
        loadThemeMap(ThemeMap).then(() => {
            for(let e of props.events){
                if(!ThemeMap.has(e.location)){
                    modified = true;
                    if(DEVELOPER_MODE)
                        console.log('[Grid>useEffect([])]: Miss ' + e.location) // debugging
                    const index = ThemeMap.size % EventColors.length
                    ThemeMap.set(e.location, EventColors[index])
                }else if(DEVELOPER_MODE)
                    console.log('[Grid>useEffect([])]: Hit ' + e.location)
            }
            setLoaded(true);
            if(modified)
            storeData('ThemeMap', JSON.stringify([...ThemeMap]))
            .then(() => {
                if(DEVELOPER_MODE)
                    console.log("[Grid>useEffect]: Stored " +
                        JSON.stringify([...ThemeMap]))  // debugging
            });
        });
    },[])
    
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
                <EventBlock key={index} data={item} theme={ThemeMap.get(item.location)} />
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