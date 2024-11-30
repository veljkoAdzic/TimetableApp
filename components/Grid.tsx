import { View, SafeAreaView, Text, StyleSheet } from 'react-native'
import EventBlock from './EventBlock'
import { EventData } from '../constants/EventTypes'

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

export default function Grid(props: GridProps){
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
                <EventBlock key={index} data={item} />
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