import {View, StyleSheet, Pressable, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import {Dropdown} from 'react-native-element-dropdown'
import { useEffect, useState } from 'react'
import TimetableScreen from '@/screens/TimetableScreen'
import { EventData } from '@/constants/EventTypes'
import { getLessonsByID } from '@/utils/timetableData'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { clearStorage, loadData, storeData } from '@/utils/localStorage'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { generateID, loadThemeMap } from '@/utils/eventTools'
import Button from '@/components/Button'

interface LocalSearchParamsType {
    classesList?: string, 
    URL?: string, 
    sharelink?:string, 
    previewMode?:any
}

export default function DownloaderPage1() {
    const router = useRouter()
    const { classesList, URL, sharelink, previewMode }:LocalSearchParamsType = useLocalSearchParams()

    const [asStorage, setASstrorage] = useState<{"ThemeMap": any, "eventData": any}|null> (JSON.parse(sharelink || "null") );

    const [ddItems, setDdItems] = useState< ({value:string, label:string})[]|null >(JSON.parse(classesList || "null"))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownValue, setDropdownValue] = useState(ddItems ? ddItems[0].value : null)

    const [lessons, setLessons] = useState<EventData[]>([])


    const [selectAll, setSelectAll] = useState(false)
    const [selections, setSelections] = useState<number[]>([])

    const [overriteModalOpen, setOverriteModalOpen] = useState(false)

    function onChange(val: string|null) {
        if(val != null)
            getLessonsByID(URL!, val)
            .then((res) => {
                setLessons(res)
            })
        else
            setLessons([])

        setSelections([])
    }

    async function handleSaveOverrite() {

        if(selections.length == 0) return

        if(asStorage) {
            const final_lessons = lessons.filter((el) => { return selections.includes(el.id) })
            await clearStorage()
            .then(() => 
            storeData('ThemeMap', JSON.stringify(asStorage["ThemeMap"]))
            .then(() => 
            storeData('eventData', JSON.stringify(final_lessons)) )
            .then(() => {
                router.dismissAll()
                router.push({pathname:'/', params: {refresh: Date.now().toString()}})
            } ))
            return;
        }

        // create theme map
        let tmp_theme = new Map<string, EventColorsType>(); 
        for (let lesson of lessons){
            if(!tmp_theme.has(lesson.location) && lesson.location.length > 0){
                const index = tmp_theme.size % EventColors.length
                tmp_theme.set(lesson.location, EventColors[index])
            }
        }

        // get only selected lessons
        const final_lessons = lessons.filter((el) => { return selections.includes(el.id) })

        // Prune theme map to store only the ones that are needed
        const final_theme = new Map<string, EventColorsType>()
        for (let less of final_lessons) {
            let loc = less.location
            
            if (!final_theme.has(loc)){
                final_theme.set(loc, tmp_theme.get(loc)!) 
            }
            
        }

        // store to async storage and redirect to root
        await clearStorage()
        .then(() => 
        storeData('ThemeMap', JSON.stringify([...final_theme]))
        .then(() => 
        storeData('eventData', JSON.stringify(final_lessons)) )
        .then(() => {
            router.dismissAll()
            router.push({pathname:'/', params: {refresh: Date.now().toString()}})
        } ))
        
    }

    async function handleSaveAppend() {
        if(selections.length == 0) return

        let themeMapShared = new Map<string, EventColorsType>();
        if(asStorage && asStorage["ThemeMap"]){
            for(let [loc, col] of asStorage["ThemeMap"])
                themeMapShared.set(loc, col)
        }

        // create theme map
        let tmp_theme = new Map<string, EventColorsType>(); 
        loadThemeMap(tmp_theme)

        for (let lesson of lessons){
            if(!tmp_theme.has(lesson.location) && lesson.location.length > 0){
                if(themeMapShared){
                    tmp_theme.set(lesson.location, themeMapShared.get(lesson.location)!)
                } else {
                    const index = tmp_theme.size % EventColors.length
                    tmp_theme.set(lesson.location, EventColors[index])
                }
            }
        }

        let final_lessons:EventData[] = await loadData('eventData').then((str:string|null|undefined) => {return ((!str) ? [] : JSON.parse(str)) } )
        const selected_lessons = lessons.filter((el) => { return selections.includes(el.id) })

        for(let selected of selected_lessons){
            selected.id = generateID(final_lessons) || -1
            final_lessons.push(selected)
        }

        // Prune theme map to store only the ones that are needed
        const final_theme = new Map<string, EventColorsType>()
        for (let less of final_lessons) {
            let loc = less.location
            
            if (!final_theme.has(loc)){
                final_theme.set(loc, tmp_theme.get(loc)!) 
            }
            
        }
        

        // store to async storage and redirect to root
        await clearStorage()
        .then(() => 
        storeData('ThemeMap', JSON.stringify([...final_theme]))
        .then(() => 
        storeData('eventData', JSON.stringify(final_lessons)) )
        .then(() => {
            router.dismissAll()
            router.push({pathname:'/', params: {refresh: Date.now().toString()}})
        } ))
        
    }

    function handleSelectAll() {  
        if(!selectAll){ // Selecting all
            setSelections(lessons.map((el) => el.id))
        } else { // Deselect all
            setSelections([])
        }
    }

    useEffect(()=>{
        if( URL && classesList)
            onChange(dropdownValue)
        else if(sharelink) {
            setASstrorage(JSON.parse(sharelink))
            setLessons(JSON.parse(sharelink)["eventData"])
            setSelections([])
        }
    },[])

    useEffect(()=>{
        if (selections.length >= lessons.length){
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    },[selections])

    useEffect(() => {
        if(dropdownValue != null)
            onChange(dropdownValue)
    }, [classesList])

    return ( 
        <View style={styles.screenContainer}>

        {overriteModalOpen ?
        <ConfirmationDialog 
        OKtext='Overrite' OK={() => {handleSaveOverrite()}} 
        CancelText='Append' Cancel={() => (handleSaveAppend())} 
        Close={() =>{setOverriteModalOpen(false)}}>
            Do you want to overrite your current lessons?
        </ConfirmationDialog>
        : <></>
        }
            <Text style={styles.title}>Please select lessons</Text>

        <View style={styles.optionsContainer}>

            { URL && classesList ?
            <View style={{flexGrow: 1}}>
                <Dropdown 
                value={dropdownValue}
                data={ddItems!}
                valueField='value'
                labelField='label'
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                onChange={(val) => {setDropdownValue(val.value); onChange(val.value)}}
                style={[styles.drowdownStyle, (dropdownOpen) ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0} : {}]}
                containerStyle={styles.dropdownMenuStyle}
                itemContainerStyle={{borderRadius: 15}}
                renderItem={(item, sleected) => (
                    <Text style={{fontSize: 14, padding: 10}}>{item.label}</Text>
                )}
                autoScroll={false}
                dropdownPosition='bottom'
                placeholder={dropdownValue || "unknown"}
                />
            </View> :
            <Text style={{fontSize: 20}}>Shared Timetable</Text>
            }

            <Pressable
            style={styles.selectAllPressable}
            onPress={handleSelectAll}>
                <MaterialCommunityIcons size={25} name={selections.length >= lessons.length ? 'radiobox-marked' : 'radiobox-blank'} color={'black'} />
                <Text style={{fontSize: 17}}>All</Text>
            </Pressable>
        </View>

            
            <View style={styles.timetableContainer} >
                <TimetableScreen key={lessons.map(l => l.id).join(',')} data={lessons} theme={asStorage ? asStorage["ThemeMap"] : undefined} selected={selections} setSelected={setSelections}/>
            </View>    
            
            <View style={styles.buttonsContainer}>
            <Button 
            onPress={() => { router.back() }} 
            buttonSyle={StyleSheet.flatten([styles.button, {color: '#222', backgroundColor: '#80B1FF'}])}
            pressStyle={{color: '#333', backgroundColor: '#A0D1FF'}}
            >
                Back
            </Button>

            <Button 
            onPress={() => {setOverriteModalOpen(true)}} 
            buttonSyle={StyleSheet.flatten([styles.button, {color: '#F0F0F0', backgroundColor: '#008000'}])}
            pressStyle={{color: '#DDD', backgroundColor: '#00A000ff'}}
            >
                Save
            </Button>
            </View>
           
        </View>
     )
}

const styles = StyleSheet.create({
    screenContainer: {
        display: 'flex', 
        flexDirection:'column', 
        gap: 30,
        height: '95%',
        padding: 25,
    },

    title: {
        textAlign: 'center', 
        fontSize: 25, 
        paddingVertical: 10
    },

    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-evenly',
        alignItems: 'baseline'
    },

    drowdownStyle: {
        borderRadius: 10,
        borderColor: '#555',
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#FAFAFA',
        elevation: 2,
        margin: 0,
    },
    dropdownMenuStyle: {
        margin: 0, 
        borderWidth: 1, 
        borderBottomLeftRadius: 10, 
        borderBottomRightRadius: 10, 
        borderColor: '#555', 
        height: 200, 
        elevation: 4, 
        padding: 5
    },

    selectAllPressable: {
        padding: 15, 
        display: 'flex', 
        flexDirection: 'row', 
        gap: 10, 
        alignItems: 'center'
    },

    timetableContainer: {
        flex:1,
        backgroundColor: 'white',
        borderLeftColor: '#8883',
        borderLeftWidth: 1,
        elevation: 5
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 35,
        padding: 15,
    },
    button: {
        fontSize: 20,
        paddingVertical: 9,
        borderRadius: 7
    }
})