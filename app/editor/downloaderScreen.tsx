import {View, StyleSheet, Pressable, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useState } from 'react'
import TimetableScreen from '@/screens/TimetableScreen'
import { EventData } from '@/constants/EventTypes'
import { getLessonsByID } from '@/utils/timetableData'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { clearStorage, storeData } from '@/utils/localStorage'

export default function DownloaderPage1() {
    const router = useRouter()
    const { classesList, URL }:{classesList: string, URL: string} = useLocalSearchParams()

    const [ddItems, setDdItems] = useState< ({value:string, label:string})[] >(JSON.parse(classesList))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownValue, setDropdownValue] = useState(ddItems[0].value)

    const [lessons, setLessons] = useState<EventData[]>([])

    const [selectAll, setSelectAll] = useState(false)
    const [selections, setSelections] = useState<number[]>([])

    function onChange(val: string|null) {
        if(val != null)
            getLessonsByID(URL, val)
            .then((res) => {
                setLessons(res)
            })
        else
            setLessons([])

        setSelections([])
    }

    async function handleSave() {

        if(selections.length == 0) return

        // create theme map
        let tmp_theme = new Map<string, EventColorsType>(); 
        for (let lesson of lessons){
            if(!tmp_theme.has(lesson.location) && lesson.location.length > 0){
                const index = tmp_theme.size % EventColors.length
                tmp_theme.set(lesson.location, EventColors[index])
            }
        }

        // Prune theme map to store only the ones that are needed
        const final_theme = new Map<string, EventColorsType>()
        for (let id of selections) {
            let less = lessons.find((el)=> {return el.id == id} )
            let loc = less!.location
            
            if (!final_theme.has(loc)){
                final_theme.set(loc, tmp_theme.get(loc)!) 
            }
            
        }

        // get only selected lessons
        const final_lessons = lessons.filter((el) => { return selections.includes(el.id) })

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
        onChange(dropdownValue)
    },[])

    useEffect(()=>{
        if (selections.length >= lessons.length){
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    },[selections])

    useEffect(() => {
        onChange(dropdownValue)
    }, [classesList])

    return ( 
        <View style={styles.screenContainer}>

            <Text style={styles.title}>Please select lessons</Text>

        <View style={styles.optionsContainer}>
            <DropDownPicker 
            open={dropdownOpen} 
            value={dropdownValue}
            items={ddItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            onChangeValue={onChange}
            setItems={setDdItems}
            style={styles.drowdownStyle}
            containerStyle={{flexGrow: 1, width: 1}}
            />

            <Pressable
            style={styles.selectAllPressable}
            onPress={handleSelectAll}>
                <MaterialCommunityIcons size={25} name={selections.length >= lessons.length ? 'radiobox-marked' : 'radiobox-blank'} color={'black'} />
                <Text style={{fontSize: 17}}>All</Text>
            </Pressable>
        </View>

            
            <View style={styles.timetableContainer} >
                <TimetableScreen key={lessons.map(l => l.id).join(',')} data={lessons} selected={selections} setSelected={setSelections}/>
            </View>    
            
            <View style={styles.buttonsContainer}>
            <Pressable onPress={() => { router.back() }}>
            { ({pressed}) =>
                <Text style={[styles.button, {backgroundColor: (pressed ? '#A0D1FF':'#80B1FF'), color: '#222'}]}>Back</Text>                
            }
            </Pressable>

            <Pressable onPress={handleSave}>
            { ({pressed}) =>
                <Text style={[styles.button, {backgroundColor: (pressed ? '#00A000ff' : '#008000')}]}>Save</Text>
            }
            </Pressable>
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
        borderRadius: 5,
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
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 35,
        padding: 15,
    },
    button: {
        backgroundColor: '#111',
        color: '#F0F0F0',
        fontSize: 20,
        paddingVertical: 9,
        paddingHorizontal: 18,
        borderRadius: 7
    }
})