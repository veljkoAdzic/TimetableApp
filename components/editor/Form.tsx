import { EventData } from "@/constants/EventTypes";
import { useState, useEffect } from "react";
import Time from "@/constants/TimeClass";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import {Dropdown} from 'react-native-element-dropdown'
import DateTimePicker from '@react-native-community/datetimepicker'
import { EventColorsType } from "@/constants/EventColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatEventTitle } from "@/utils/eventTools";

export default function Form(props: {data: EventData, theme: EventColorsType, editCallback: (edit: EventData) => void, openThemeEditor: (loc: string) => void}){
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

    const [formErrors, setFormErrors] = useState('')

    function validateForm(value: EventData){
        let res:string = ''
        if(value.title.length == 0){
            setFormErrors('title')
            return 'title'
        }
        if(!value.shortTitle || value.shortTitle.length == 0){
            setFormErrors('shortTitle')
            return 'shortTitle'
        }
        if(value.location.length == 0){
            setFormErrors('location')
            return 'location'
        }
        if(value.teacher.length == 0){
            setFormErrors('teacher')
            return 'teacher'
        }
        if(value.startTime[0] < 8 || value.startTime[0] > 21){
            setFormErrors('startTime')
            return 'startTime'
        }
        if(value.endTime[0] < 8 || value.endTime[0] > 21 || 
           value.endTime[0] < value.startTime[0] || 
           (value.startTime[0] == value.endTime[0] && 
           value.endTime[1] <= value.startTime[1])
        ){
            setFormErrors('endTime')
            return 'endTime'
        }

        setFormErrors('')
        return res
    }

    useEffect(() => {
        setFormData(props.data);
        setDropdownValue(props.data.day);
        setStartTime(new Time(props.data.startTime));
        setEndTime(new Time(props.data.endTime));
    }, [props.data]);

    const saveTitle = () => {
        let tmp = {...formData}
        tmp.title = tmp.title.trim()
        setFormData(tmp)
        if(validateForm(tmp) != 'title')
            props.editCallback(tmp)
    }
    const saveShortText = () => {
        let tmp = {...formData}
        tmp.shortTitle = tmp.shortTitle!.trim()
        setFormData(tmp)
        if(validateForm(tmp) != 'shortTitle')
            props.editCallback(tmp)
    }
    const saveLocation = () => {
        let tmp = {...formData}
        tmp.location = tmp.location.trim()
        setFormData(tmp)
        if(validateForm(tmp) != 'location')
            props.editCallback(tmp)
    }
    const saveTeacher =  () => {
        let tmp = {...formData}
        tmp.teacher = tmp.teacher!.trim()
        setFormData(tmp)
        if(validateForm(tmp) != 'teacher')
            props.editCallback(tmp)
    }

    const saveGroup =  () => {
        let tmp = {...formData}
        tmp.group = tmp.group.trim()
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
        if(validateForm(tmp) != 'startTime')
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

        if(validateForm(tmp) != 'endTime')
            props.editCallback(tmp) 
    }
    const saveDay = (day: string | null) => {
        if (day == null) return; 
        let tmp = {...formData, day}
        setFormData(tmp); 
        props.editCallback(tmp)
    }

    return (
        <View style={{padding: 35, paddingBottom: 18, width: '100%'}}>
            {/* FullName TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}, (formErrors.includes('title'))? styles.error : {}]}
            onChangeText={(title) => { 
                let tmp = {...formData, title};
                setFormData(tmp)
                if(validateForm(tmp) != 'title')
                    props.editCallback(tmp)
            }
            }
            onEndEditing={saveTitle}
            
            value={formData.title}
            placeholder='Class name'
            />

            {/* ShortName TextInput */}
            <View style={{flexDirection: 'row'}}>
            <TextInput
            style={[styles.input, {color: props.theme.text, flexGrow: 1}, (formErrors.includes('shortTitle'))? styles.error : {}]}
            onChangeText={(shortTitle) => { 
                let tmp = {...formData, shortTitle};
                setFormData(tmp)
                if(validateForm(tmp) != 'shortTitle')
                    props.editCallback(tmp)
            }
            }
            onEndEditing={ saveShortText }
            value={formData.shortTitle}
            placeholder='Display name'
            />
            <Pressable style={styles.button} onPress={() => { 
                let tmp = {...formData}
                tmp.shortTitle = formatEventTitle(tmp.title)
                setFormData(tmp)
                if(validateForm(tmp) != 'shortTitle')
                    props.editCallback(tmp)
             }}>
            <MaterialCommunityIcons name="auto-fix" color={props.theme.text} size={24} />
            </Pressable>
            </View>

            {/* Location TextInput */}
            <View style={{flexDirection: 'row'}}>
            <TextInput
            style={[styles.input, {color: props.theme.text, flexGrow: 1}, (formErrors.includes('location'))? styles.error : {}]}
            onChangeText={(location) => { 
                let tmp = {...formData, location}
                setFormData(tmp)
            }
            }
            onEndEditing={ saveLocation }
            value={formData.location}
            placeholder='Location'
            />
            <Pressable style={[styles.button, (formErrors.includes('location'))? styles.error : {}]} onPress={() => { 
                if (formErrors.includes('location')) return
                saveLocation()
                props.openThemeEditor(formData.location)
             }}>
            <MaterialCommunityIcons name="palette" color={( formErrors.includes('location') ? '#444' : props.theme.text)} size={24} />
            </Pressable>
            </View>

            {/* Teachers TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}, (formErrors.includes('teacher'))? styles.error : {}]}
            onChangeText={(teacher) => { 
                let tmp = {...formData, teacher};
                setFormData(tmp)
                if(validateForm(tmp) != 'teacher')
                    props.editCallback(tmp)
            }
            }
            onEndEditing={ saveTeacher }
            value={formData.teacher}
            placeholder='Teacher'
            />

            {/* Group TextInput */}
            <TextInput
            style={[styles.input, {color: props.theme.text}]}
            onChangeText={(group) => { 
                let tmp = {...formData, group};
                setFormData(tmp)
                if(validateForm(tmp) != 'group')
                    props.editCallback(tmp)
            }
            }
            onEndEditing={ saveGroup }
            value={formData.group}
            placeholder='Group'
            />

            {/* StartTime Input */}
            <View style={styles.TimeSection}>
                <Text style={[{fontSize: 20, paddingHorizontal: 5, color: props.theme.text}]}>Start Time</Text>

                <Pressable onPress={() => {setStartTimeVisible(true)}}>
                <Text style={[styles.TimeButton, {color: props.theme.text}, (formErrors.includes('startTime'))? styles.error : {}]}>{StartTime.toString()}</Text>
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
                <Text style={[styles.TimeButton, {color: props.theme.text}, (formErrors.includes('endTime'))? styles.error : {}]}>{EndTime.toString()}</Text>
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
            <View style={{margin: 12, overflow: 'visible'  }} >
            <Dropdown 
            value={dropdownValue}
            data={ddItems}
            valueField='value'
            labelField='label'
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
            onChange={(val) => {setDropdownValue(val.value); saveDay(val.value)}}
            style={styles.DropdownStyle}
            selectedTextStyle={{color: props.theme.text, borderRadius: 10,}}
            iconColor={props.theme.text}
            itemContainerStyle={{borderRadius: 10, margin: 0}}
            keyboardAvoiding={false}
            activeColor="#FFF3"
            containerStyle={[styles.dropdownMenuStyle, {backgroundColor: props.theme.background}]}
            flatListProps={{style:{}}}
            renderItem={(item, sleected) => (
                <Text 
                style={ {fontSize: 14, padding: 10, color: props.theme.text} }>
                    {item.label}
                </Text>
            )}
            autoScroll={false}
            dropdownPosition='bottom'
            placeholder={dropdownValue}
            />            
            </View>
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
        fontSize: 14,
        lineHeight: 15
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
    DropdownStyle: {
        backgroundColor: '#FFF4',
        borderRadius: 0,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        margin: 0,
    },
    dropdownMenuStyle: {
        margin: 0, 
        borderWidth: 1, 
        borderColor: '#000', 
        height: 400,
        padding: 3,
        top: -37,
    },
    button: {
        borderColor: 'black', 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        aspectRatio: 1/1, 
        height: 40,
        backgroundColor: '#FFF4',
        margin: 12,
        marginLeft: 0
    },
    error: {
        borderColor: '#F55',
        backgroundColor: '#F554'
    }
})