import { View, FlatList, Text, StyleSheet, Pressable} from 'react-native'
import React, { useCallback, useState } from 'react'
import { DAYS, EventData } from '@/constants/EventTypes'
import { loadData } from '@/utils/localStorage'
import { formatEventTitle, loadThemeMap } from '@/utils/eventTools'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import EditorButtons from '@/components/editor/Buttons'
import { DEVELOPER_MODE } from '@/constants/Settings'
import Item from '@/components/editor/Item'
import { storeData } from '@/utils/localStorage'
import { router, useRouter, useFocusEffect } from 'expo-router'

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

const SECTIONS_END = ".IGNORE"
const sections = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Others', SECTIONS_END]

const ThemeMap = new Map<string, EventColorsType>()

export default function Editor(props: EditorProps) {
    const [data, setData] = useState<EventData[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useFocusEffect(
    useCallback(()=>{ // Memoising the function
        setLoading(true)
        
        // load the theme map into the variable
        loadThemeMap(ThemeMap)
        .then(() =>{
            if(DEVELOPER_MODE)
                console.log("[editor>useFocusEffect]: ThemeMap loaded!")
        })
        .catch(() =>{
            if(DEVELOPER_MODE)
                console.error("[editor>useFocusEffect]: failed to load ThemeMap!")
        })

        // get data from props or from storage
        if(props.data != undefined)
            setData(props.data)
        else{
            loadData('eventData')
            .then(res =>{
                let tmp = (res)? JSON.parse(res) : []
                
                setData(tmp)
            })
        }
        
        //populate shortTitle (backwards compatability)
        let tmp =[]
        let mod = false
        for( let d of data ){
            if(!d.shortTitle){
                d.shortTitle = formatEventTitle(d.title)
                mod = true
            }
            tmp.push(d)
        }
        if(mod)
            setData(tmp)

        setLoading(false);

        return () =>{} // must return function

    }, [])
    );

    if(loading){
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    function editData(changes: EventData, id: number){
        let tmp = [...data]
        tmp = tmp.map((item) => item.id == id ? changes : item)
        setData(tmp);
    }

    const renderSections = ({item, index}: {item:string, index: number}) => {
        if(item == SECTIONS_END){
            return(
                <View style={styles.section}>
                    
                <View style={[styles.title, {opacity: 1, justifyContent: 'space-evenly', gap: 10, marginTop: 50 , width: '80%'}]}>
                
                    
                    <Pressable
                    onPress={ () => {
                        // SAVE
                        storeData('eventData', JSON.stringify(data))
                        router.push({pathname:'/', params: {refresh: Date.now().toString()}})
                    } }
                    >
                        <Text style={[styles.button, {backgroundColor: 'lime'}]}>Save</Text>
                    </Pressable>

                    <Pressable
                    onPress={ () => {
                        // DISCARD
                        router.push({pathname:'/'})
                    } }
                    >
                        <Text style={[styles.button, {backgroundColor: 'red'}]}>Discard</Text>
                    </Pressable>


                </View> 
                </View>
            )
        }

        return (
            <View style={styles.section}>
                <Title text ={item} />
                <View style={styles.itemContainer}>
                    {
                        data.filter((event) => (index != sections.length-1 && event.day == DAYS[index]) || 
                                                (index == sections.length-1 && !DAYS.includes(event.day))
                                    )
                        .map((tile, j) => {
                            return <Item key={tile.id} data={tile} ThemeMap={ThemeMap} editCallback={editData}/>
                        })
                    }
                </View>
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
            <FlatList style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 100}}
            data={sections}
            initialNumToRender={4}
            renderItem={ renderSections } />

            <EditorButtons />
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
    button: { 
        paddingHorizontal: 18, 
        paddingVertical: 6, 
        color: 'white', 
        fontSize: 24,
        borderRadius: 6,
    }
})