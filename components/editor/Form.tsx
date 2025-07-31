import { EventData } from "@/constants/EventTypes";
import { useState, useEffect } from "react";
import Time from "@/constants/TimeClass";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { EventColorsType } from "@/constants/EventColors";

export default function Form(props: {data: EventData, theme: EventColorsType, editCallback: (edit: EventData) => void}){
    const [formData, setFormData] = useState(props.data)

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ddItems, setDdItems] = useState([
        {label: 'Monday', value: 'MON'},
        {label: 'Tuesday', value: 'TUE'},
        {label: 'Wednesday', value: 'WED'},
        {label: 'Thursday', value: 'THU'},
        {label: 'Friday', value: 'FRI'},
    ])
    const [dropdownValue, setDropdownValue] = useState(formData.day);

    const [StartTime, setStartTime] = useState(new Time(formData.startTime))
    const [startTimeVisible, setStartTimeVisible] = useState(false)

    const [EndTime, setEndTime] = useState(new Time(formData.endTime))
    const [endTimeVisible, setEndTimeVisible] = useState(false)

    useEffect(() => {
        setFormData(props.data);
        setDropdownValue(props.data.day);
        setStartTime(new Time(props.data.startTime));
        setEndTime(new Time(props.data.endTime));
    }, [props.data]);

    const showStartTimePicker = () => {
        setStartTimeVisible(true);
    }

    const saveTitle = () => {
        let tmp = {...formData}
        tmp.title = tmp.title.trim()
        setFormData(tmp)
        props.editCallback(tmp)
    }
    const saveShortText = () => {
        let tmp = {...formData}
        tmp.shortTitle = tmp.shortTitle!.trim()
        setFormData(tmp)
        props.editCallback(tmp)
    }
    const saveLocation = () => {
        let tmp = {...formData}
        tmp.location = tmp.location.trim()
        setFormData(tmp)
        props.editCallback(tmp)
    }
    const saveTeacher =  () => {
        let tmp = {...formData}
        tmp.teacher = tmp.teacher!.trim()
        setFormData(tmp)
        props.editCallback(tmp)
    }
    const saveStartTime = (ev: any, selected: Date | undefined) => {
        if (selected == undefined) return;

        const curr = new Time(selected)
        setStartTimeVisible(false);

        setStartTime(curr)
        
        const startTime = [curr.hours, curr.minutes]
        let tmp = {...formData, startTime}

        setFormData(tmp);

        props.editCallback(tmp)
    }
    const saveEndTime = (ev: any, selected: Date | undefined) => {
        if (selected == undefined) return;

        const curr = new Time(selected)
        setEndTimeVisible(false);

        setEndTime(curr)
        
        const endTime = [curr.hours, curr.minutes]
        let tmp = {...formData, endTime}

        setFormData(tmp);

        props.editCallback(tmp) 
    }
    const saveDay = (day: string | null) => {
        if (day == null) return; 
        let tmp = {...formData, day}
        setFormData(tmp); 
        props.editCallback(tmp)
    }

    return (
        <View style={{padding: 35, paddingBottom: 18}}>
            {/* FullName TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}]}
            onChangeText={(title) => { 
                let tmp = {...formData, title};
                setFormData(tmp)
            }
            }
            onEndEditing={saveTitle}
            value={formData.title}
            placeholder='Class name'
            />

            {/* ShortName TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}]}
            onChangeText={(shortTitle) => { 
                let tmp = {...formData, shortTitle};
                setFormData(tmp)
            }
            }
            onEndEditing={ saveShortText }
            value={formData.shortTitle}
            placeholder='Display name'
            />

            {/* Location TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}]}
            onChangeText={(location) => { 
                let tmp = {...formData, location}
                setFormData(tmp)
            }
            }
            onEndEditing={ saveLocation }
            value={formData.location}
            placeholder='Location'
            />

            {/* Teachers TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}]}
            onChangeText={(teacher) => { 
                let tmp = {...formData, teacher};
                setFormData(tmp)
            }
            }
            onEndEditing={ saveTeacher }
            value={formData.teacher}
            placeholder='Teacher'
            />

            {/* StartTime Input */}
            <View style={styles.TimeSection}>
                <Text style={[{fontSize: 20, paddingHorizontal: 5, color: props.theme.text}]}>Start Time</Text>

                <Pressable onPress={() => {setStartTimeVisible(true)}}>
                <Text style={[styles.TimeButton, {color: props.theme.text}]}>{StartTime.toString()}</Text>
                </Pressable>
                
                {startTimeVisible &&
                <DateTimePicker
                value={StartTime.toDate()} 
                mode={'time'}
                is24Hour={true}
                onChange={saveStartTime}
                />}
            </View>

            {/* EndTime Input */}
            <View style={styles.TimeSection}>
                <Text style={[{fontSize: 20, paddingHorizontal: 5, color: props.theme.text}]}>End Time</Text>

                <Pressable onPress={() => {setEndTimeVisible(true)}}>
                <Text style={[styles.TimeButton, {color: props.theme.text}]}>{EndTime.toString()}</Text>
                </Pressable>
                
                {endTimeVisible &&
                <DateTimePicker
                value={EndTime.toDate()} 
                mode={'time'}
                is24Hour={true}
                onChange={saveEndTime}
                />}
            </View>

            {/* Day Dropdown */}
            <DropDownPicker 
            open={dropdownOpen} 
            value={dropdownValue}
            items={ddItems}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            onChangeValue={saveDay}
            setItems={setDdItems}
            style={styles.DrowdownStyle}
            labelStyle={{color: props.theme.text}}
            arrowIconStyle={{tintColor: props.theme.text}} // tintColor is a property, TS is weird
            dropDownContainerStyle={{margin: 12, borderRadius: 0}}
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
        backgroundColor: '#FFF4', 
    },
    TimeSection: {
        padding: 12, 
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 5,
    },
    TimeButton: {
        fontSize:14, 
        backgroundColor: '#FFF4', 
        borderWidth: 1,
        padding: 12 
    },
    DrowdownStyle: {
        margin: 12,
        backgroundColor: '#FFF4',
        borderRadius: 0
    }
})