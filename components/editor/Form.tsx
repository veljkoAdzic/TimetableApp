import { EventData } from "@/constants/EventTypes";
import { useState, useEffect } from "react";
import Time from "@/constants/TimeClass";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'


export default function Form(props: {data: EventData, editCallback: (edit: EventData) => void}){
    const [formData, setFormData] = useState(props.data)

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ddItems, setDdItems] = useState([
        {label: 'Monday', value: 'MON'},
        {label: 'Tuesday', value: 'TUE'},
        {label: 'Wednesday', value: 'WED'},
        {label: 'Thursday', value: 'THU'},
        {label: 'Friday', value: 'FRI'},
        {label: 'Other', value: '-'}
    ])
    const [day, setDay] = useState(formData.day);

    // useEffect(()=>{props.editCallback(formData); console.log(formData)},[formData])

    useEffect(() => {
        if (day == formData.day) return;

        let tmp = {...formData, day};
        setFormData(tmp);
        props.editCallback(formData)
    },[day])

    const [StartTime, setStartTime] = useState(new Time(formData.startTime))
    const [startTimeVisible, setStartTimeVisible] = useState(false)

    const [EndTime, setEndTime] = useState(new Time(formData.endTime))
    const [endTimeVisible, setEndTimeVisible] = useState(false)

    useEffect(()=>{
        setStartTime(new Time(formData.startTime))
    },[])

    const showStartTimePicker = () => {
        setStartTimeVisible(true);
    }

    return (
        <View>
            <TextInput
            style={styles.input}
            onChangeText={(title) => { 
                let tmp = {...formData, title};
                setFormData(tmp)
            }
            }
            onEndEditing={ ()=>{
                let tmp = {...formData}
                tmp.title = tmp.title.trim()
                setFormData(tmp)
                props.editCallback(formData)
            } }
            value={formData.title}
            placeholder='Class name'
            />

            <TextInput
            style={styles.input}
            onChangeText={(shortTitle) => { 
                let tmp = {...formData, shortTitle};
                setFormData(tmp)
            }
            }
            onEndEditing={ ()=>{
                let tmp = {...formData}
                tmp.shortTitle = tmp.shortTitle!.trim()
                setFormData(tmp)
                props.editCallback(formData)
            } }
            value={formData.shortTitle}
            placeholder='Display name'
            />

            <TextInput
            style={styles.input}
            onChangeText={(location) => { 
                let tmp = {...formData, location}
                setFormData(tmp)
            }
            }
            onEndEditing={ ()=>{
                let tmp = {...formData}
                tmp.location = tmp.location.trim()
                setFormData(tmp)
                props.editCallback(formData)
            } }
            value={formData.location}
            placeholder='Location'
            />

            <View style={{padding: 12, flexDirection:'row', alignItems: 'center', gap: 5}}>
                <Text style={[{fontSize: 20, paddingHorizontal: 5}]}>Start Time</Text>

                <Pressable onPress={() => {setStartTimeVisible(true)}}>
                <Text style={{fontSize:14, color: 'white', backgroundColor: 'black', padding: 12 }}>{StartTime.toString()}</Text>
                </Pressable>
                
                {startTimeVisible &&
                <DateTimePicker
                value={StartTime.toDate()} 
                mode={'time'}
                is24Hour={true}
                onChange={(ev, selected) => {
                    if (selected == undefined) return;

                    const curr = new Time(selected)
                    setStartTimeVisible(false);

                    setStartTime(curr)
                    
                    const startTime = [curr.hours, curr.minutes]
                    let tmp = {...formData, startTime}

                    setFormData(tmp);

                    props.editCallback(tmp) // IDK WHYYYY but when using formData it isn't updating
                }}
                />}
            </View>

            <View style={{padding: 12, flexDirection:'row', alignItems: 'center', gap: 5}}>
                <Text style={[{fontSize: 20, paddingHorizontal: 5}]}>End Time</Text>

                <Pressable onPress={() => {setEndTimeVisible(true)}}>
                <Text style={{fontSize:14, color: 'white', backgroundColor: 'black', padding: 12 }}>{EndTime.toString()}</Text>
                </Pressable>
                
                {endTimeVisible &&
                <DateTimePicker
                value={EndTime.toDate()} 
                mode={'time'}
                is24Hour={true}
                onChange={(ev, selected) => {
                    if (selected == undefined) return;

                    const curr = new Time(selected)
                    setEndTimeVisible(false);

                    setEndTime(curr)
                    
                    const endTime = [curr.hours, curr.minutes]
                    let tmp = {...formData, endTime}

                    setFormData(tmp);

                    props.editCallback(tmp) // IDK WHYYYY but when using formData it isn't updating
                }}
                />}
            </View>

            <DropDownPicker 
            open={dropdownOpen} 
            value={formData.day}
            items={ddItems}
            setOpen={setDropdownOpen}
            setValue={setDay}
            setItems={setDdItems}
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})