import {View, StyleSheet, Pressable, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useState } from 'react'
import TimetableScreen from '@/screens/TimetableScreen'
import { EventData } from '@/constants/EventTypes'
import { getLessonsByID } from '@/utils/timetableData'
import { MaterialCommunityIcons } from '@expo/vector-icons'
export default function DownloaderPage1() {
    const router = useRouter()
    const { classesList, URL }:{classesList: string, URL: string} = useLocalSearchParams()

    const [ddItems, setDdItems] = useState< ({value:string, label:string})[] >(JSON.parse(classesList))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownValue, setDropdownValue] = useState(ddItems[0].value)

    const [lessons, setLessons] = useState<EventData[]>([])

    const [selectAll, setSelectAll] = useState(false)

    function onChange(val: string|null) {
        if(val != null)
            getLessonsByID(URL, val)
            .then((res) => {
                setLessons(res)
            })
        else
            setLessons([])
    }

    useEffect(()=>{
        onChange(dropdownValue)
    },[])

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
            onPress={() => {setSelectAll(!selectAll)}}>
                <MaterialCommunityIcons size={25} name={selectAll ? 'radiobox-marked' : 'radiobox-blank'} color={'black'} />
                <Text style={{fontSize: 17}}>All</Text>
            </Pressable>
        </View>

            <View style={styles.timetableContainer} >
                <TimetableScreen data={lessons}/>
            </View>    
            
            <View style={styles.buttonsContainer}>
            <Pressable onPress={() => { router.back() }}>
                <Text style={[styles.button, {backgroundColor: '#80B1FF', color: '#222'}]}>Back</Text>
            </Pressable>

            <Pressable onPress={() => { /*TODO*/ }}>
                <Text style={[styles.button, {backgroundColor: 'green'}]}>Save</Text>
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
        borderRadius: 3
    }
})