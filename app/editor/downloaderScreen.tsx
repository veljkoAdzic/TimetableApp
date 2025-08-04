import {View, Text, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker'
import { useEffect, useState } from 'react'
import TimetableScreen from '@/screens/TimetableScreen'
import { EventData } from '@/constants/EventTypes'
import { getLessonsByID } from '@/utils/timetableData'
export default function DownloaderPage1() {
    const router = useRouter()
    const { classesList, URL }:{classesList: string, URL: string} = useLocalSearchParams()

    const [ddItems, setDdItems] = useState< ({value:string, label:string})[] >(JSON.parse(classesList))
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownValue, setDropdownValue] = useState(ddItems[0].value)

    const [lessons, setLessons] = useState<EventData[]>([])
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
        <View style={{display: 'flex', flexDirection:'column', gap: 25, height: '90%'}}>
            <DropDownPicker 
            open={dropdownOpen} 
            value={dropdownValue}
            items={ddItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            onChangeValue={onChange}
            setItems={setDdItems}
            // style={styles.DrowdownStyle}
            // labelStyle={{color: props.theme.text}}
            // arrowIconStyle={{tintColor: props.theme.text}} // tintColor is a property, TS is weird
            // dropDownContainerStyle={{margin: 12, borderRadius: 0}}
            />

            <View style={{flex:1}} >
                <TimetableScreen data={lessons}/>
            </View>    
            {/*
            <Pressable onPress={() => { router.back() }}>
                <Text>Go back</Text>
            </Pressable>
            */}
        </View>
     )
}