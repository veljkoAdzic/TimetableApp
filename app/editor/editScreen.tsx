import { View, FlatList, Text, StyleSheet, Animated, Pressable} from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { DAYS, DefaultEventData, EventData } from '@/constants/EventTypes'
import { loadData } from '@/utils/localStorage'
import { formatEventTitle, generateID, loadThemeMap } from '@/utils/eventTools'
import { EventColorsType } from '@/constants/EventColors'
import { DEVELOPER_MODE } from '@/constants/Settings'
import Item from '@/components/editor/Item'
import { storeData } from '@/utils/localStorage'
import { useRouter, useFocusEffect } from 'expo-router'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import ItemEditModal from '@/components/editor/ItemModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { LessonEditingContext } from '@/constants/Contexts'
import Time from '@/constants/TimeClass'

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

const sections = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Others']

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

    // Big buttons stuff
    const rotation = useRef(new Animated.Value(0)).current;
    const editY  = useRef(new Animated.Value(0)).current;
    const downloadY  = useRef(new Animated.Value(0)).current;
    const [BBopen, setBBOpen] = useState(false);

     const rotateTo = (toValue: number) => {
        Animated.timing( rotation, {
            toValue,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }
    const moveEdit = (toValue: number) => {
        Animated.timing( editY, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }
    const moveDownload = (toValue: number) => {
        Animated.timing( downloadY, {
            toValue,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }
    const toggleOpening = () => {
        rotateTo(BBopen ? 0 : 1)
        moveDownload(BBopen ? 0 : 1)
        moveEdit(BBopen ? 0 : 1)
        setBBOpen(!BBopen)
    }
    const editBBStyle = {
        transform: [{
            "translateY": editY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -155]
            })
        }]
    }
    const downloadBBStyle = {
        transform: [{
            "translateY": downloadY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -85]
            })
        }]
    }
    const rotationBBStyle = {
        transform: [{
            "rotate": rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg'],
            }),
        }]
    }
    //~

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
        return (
            <View key={item} style={styles.section}>
                <Title text ={item} />
                <View style={styles.itemContainer}>
                    {
                        data.filter((event) => (index != sections.length-1 && event.day == DAYS[index]) || 
                                                (index == sections.length-1 && !DAYS.includes(event.day))
                                    )
                        .sort((a, b) => {
                            let A_time = new Time(a.startTime)
                            let B_time = new Time(b.startTime)

                            return (A_time.hours*100 + A_time.minutes) - (B_time.hours*100 + B_time.minutes)
                        })
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

            

            <LessonEditingContext.Provider value={{openItem, setOpenItem, editData, deleteElemenet, handleClose}} >
            <ItemEditModal 
            key={openItem?.id ?? 'new'} 
            data={openItem}
            ThemeMap={ThemeMap} 
            />
            </LessonEditingContext.Provider>

            
            <FlatList style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 100}}
            data={sections}
            extraData={data}
            initialNumToRender={4}
            renderItem={ ({item, index}:{item: string, index: number}) => {return (
                <RenderedSections item={item} index={index} data={data} />
            )} } 
            />

            { BBopen ? 
                <Pressable style={styles.cancelArea} onPress={toggleOpening} /> :
                <></>
            }

            <View style={styles.bottomBar}>
                <Button onPress={
                () => {
                    // SAVE

                    // Remove unused mappings
                    let tmp = new Map()
                    for( let [key, val] of ThemeMap.entries()){
                        if(data.filter((val) => val.location == key).length > 0){
                            tmp.set(key, val)
                        }
                    }                   

                    storeData('ThemeMap', JSON.stringify([...tmp]))
                    .then(() => storeData('eventData', JSON.stringify(data)) )
                    .then(() => router.push({pathname:'/', params: {refresh: Date.now().toString()}}) )
                }} 
                buttonSyle={{backgroundColor: '#22aa22ff', color: '#FFF'}} 
                pressStyle={{backgroundColor: '#38be38ff', color: '#EEE'}} >
                    Save
                </Button>

                <Button onPress={() => {/* DISCARD */ setCDvisible(true)}}
                buttonSyle={{backgroundColor: '#e91f30ff', color: '#FFF'}}
                pressStyle={{backgroundColor: '#fc4c5bff', color: '#EEE'}}>
                    Discard
                </Button>

                {/* Big animated buttons */}
                <View style={[styles.bigButtonWraper]}>
                    <View style={styles.buttonContainer}>

                        <Animated.View style={[styles.bigButton, editBBStyle]}>
                            <Pressable style={{padding: 10}}
                            onPress={() => { toggleOpening(); createNewLesson(); }}>
                                <MaterialCommunityIcons name="pencil-plus" size={40} color='#eee' />
                            </Pressable>
                        </Animated.View>
                    
                        <Animated.View style={[styles.bigButton, downloadBBStyle]}>
                            <Pressable style={{padding: 10}}
                            onPress={() => { toggleOpening(); router.push("/editor/endpointScreen") }}>
                                    <MaterialCommunityIcons name="cloud-download" size={40} color='#eee' />
                            </Pressable>
                        </Animated.View> 
                            

                        <Animated.View style={[styles.bigButton, rotationBBStyle, BBopen ? {backgroundColor: '#2f3646ff'}:{} ]}>
                            <Pressable style={{padding: 10}}
                            onPress={toggleOpening}>
                                <MaterialCommunityIcons name="plus" size={50} color='#eee' />
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>

            </View>

            

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
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
    bottomBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#f0f1f2',
        minHeight: '15%',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: '5%',
        elevation: 15,
        zIndex: 10
    },

    bigButtonWraper: {
        zIndex: 10,
        width: 72, 
        aspectRatio: 1/1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    bigButton :{
        borderRadius: "50%",
        backgroundColor: '#212631',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1/1,
        position: 'absolute',
        bottom: 0,
        elevation: 2,
        zIndex: 10
    },
    cancelArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    }
        
})