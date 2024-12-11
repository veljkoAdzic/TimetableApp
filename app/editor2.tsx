import { View, FlatList, ScrollView, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace'
import { DAYS, EventData } from '@/constants/EventTypes'
import { loadData } from '@/utils/localStorage'

interface EditorProps {
    data?: EventData[]
}

function Title(props: {text: string}) {
    return (
        <View style={styles.title}>
            <Text style={styles.titleText}>{props.text}</Text>
            <View style={styles.titleLine} />
        </View>
    )
}

function Item(props: {data: EventData}) {
    return(
        <View style={styles.item}>
            <Text>{props.data.title + "\n" + props.data.location}</Text>
        </View>
    )
}

const sections = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Others']

export default function Editor(props: EditorProps) {
    const [data, setData] = useState<EventData[]>([
        {
            title: "EV1",
            day: 'MON',
            startTime: [8, 0],
            endTime: [10, 45],
            location: "AMF PED",
            extra_descriptions: ["Prof a"]
        },
        {
            title: "EV2",
            day: 'TUE',
            startTime: [8, 0],
            endTime: [10, 45],
            location: "AMF PED",
            extra_descriptions: ["Prof a"]
        },
        {
            title: "EVn",
            day: 'SUN',
            startTime: [8, 0],
            endTime: [10, 45],
            location: "AMF PED",
            extra_descriptions: ["Prof a"]
        },
    ])

    useEffect(() =>{
        if(props.data != undefined)
            setData(props.data)
        else{
            loadData('timetableData')
            .then(res =>{
                let tmp = (res)? JSON.parse(res) : []
                setData(tmp)
            })
        }
    }, [])

    const renderSections = ({item, index}: {item:string, index: number}) => {
        return (
            <View style={styles.section}>
                <Title text ={item} />
                <View style={styles.itemContainer}>
                    {
                        data.filter((event) => (index != sections.length-1 && event.day == DAYS[index]) || 
                                                (index == sections.length-1 && !DAYS.includes(event.day))
                                    )
                        .map((tile, j) => {
                            return <Item key={j} data={tile} />
                        })
                    }
                </View>
            </View>
        )}
    return (
        <View style={styles.container}>
            <FlatList style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 100}}
            data={sections}
            initialNumToRender={4}
            renderItem={ renderSections } />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: "1%",
    },
    section: {
        width: '100%',
    },
    title: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingHorizontal: 10,
        opacity: 0.25
    },
    titleText: {
        color: 'black',
        paddingHorizontal: 5
    },
    titleLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '3%',
        padding: '1%',
        minHeight: 50,
        
        paddingHorizontal: 15
    },
    item: {
        backgroundColor: 'orange',
        height: 110,
        aspectRatio: 6/8,
        borderRadius: 5
    }
})