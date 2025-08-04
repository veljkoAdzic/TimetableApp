import { View, FlatList, Text, StyleSheet, Pressable} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { DAYS, DefaultEventData, EventData } from '@/constants/EventTypes'
import { loadData } from '@/utils/localStorage'
import { formatEventTitle, generateID, loadThemeMap } from '@/utils/eventTools'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import EditorButtons from '@/components/editor/Buttons'
import { DEVELOPER_MODE } from '@/constants/Settings'
import Item from '@/components/editor/Item'
import { storeData } from '@/utils/localStorage'
import { useRouter, useFocusEffect } from 'expo-router'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import ItemEditModal from '@/components/editor/ItemModal'

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
    const [cdVisible, setCDvisible] = useState(false)
    const router = useRouter()
    let [openItem, setOpenItem] = useState<EventData | null>(null);

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
        let tmp = data.map((item) => item.id == id ? changes : item)
        setData(tmp);
    }

    function deleteElemenet(id: number){
        let tmp = data.filter((item, ind) => item.id != id )
        setOpenItem(null)
        setData(tmp)
    }

    function openEditingItem(item: EventData){
        setOpenItem(item)
    }

    function createNewLesson(){
        let id = generateID(data)
        if (!id) return

        let newLesson: EventData = {...DefaultEventData, id}

        let tmp = [...data]
        tmp.push(newLesson)
        setOpenItem(newLesson)
        setData(tmp)
    }

    function handleClose(final: EventData | null) {
        if(final)
            editData(final, final.id); 
        setOpenItem(null)
    }

    const RenderedSections = React.memo(
        ({item, index, data}: {item: string, index: number, data: EventData[]}) =>{
        if(item == SECTIONS_END){
            return(
                <View key={item} style={styles.section}>
                    
                <View style={[styles.title, {opacity: 1, justifyContent: 'space-evenly', gap: 10, marginTop: 50 , width: '80%'}]}>
                
                    
                    <Pressable
                    onPress={ () => {
                        // SAVE
                        storeData('ThemeMap', JSON.stringify([...ThemeMap]))
                        .then(() => storeData('eventData', JSON.stringify(data)) )
                        .then(() => router.push({pathname:'/', params: {refresh: Date.now().toString()}}) )
                    } }
                    >
                        <Text style={[styles.button, {backgroundColor: 'green'}]}>Save</Text>
                    </Pressable>

                    <Pressable
                    onPress={ () => {
                        // DISCARD
                        setCDvisible(true)
                    } }
                    >
                        <Text style={[styles.button, {backgroundColor: 'red'}]}>Discard</Text>
                    </Pressable>


                </View> 
                </View>
            )
        }

        return (
            <View key={item} style={styles.section}>
                <Title text ={item} />
                <View style={styles.itemContainer}>
                    {
                        data.filter((event) => (index != sections.length-2 && event.day == DAYS[index]) || 
                                                (index == sections.length-2 && !DAYS.includes(event.day))
                                    )
                        .map((tile, j) => {
                            return <Item key={tile.id} data={tile} theme={ThemeMap.get(tile.location)} openCallback={openEditingItem} />
                        })
                    }
                </View>
            </View>
        )
        }
    )
    return (
        <View style={styles.container}>

            { cdVisible ?
            <ConfirmationDialog
            OK={()=>{
                setCDvisible(false)
                router.push({pathname:'/'})
            }}
            Cancel={() =>{ setCDvisible(false) }}
            >
                Discard all changes?
            </ConfirmationDialog>
             :
            <></>
            }


            <ItemEditModal 
            key={openItem?.id ?? 'new'} 
            data={openItem}
            ThemeMap={ThemeMap} 
            editCallback={editData} 
            deleteCallback={deleteElemenet} 
            closeCallback={handleClose}
            />

            
            <FlatList style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 100}}
            data={sections}
            extraData={data}
            initialNumToRender={4}
            renderItem={ ({item, index}:{item: string, index: number}) => {return (
                <RenderedSections item={item} index={index} data={data} />
            )} } 
            />

            <EditorButtons editButtonFunction={createNewLesson}/>
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