import { View, Text, Pressable, StyleSheet, StyleSheetProperties, Modal, ViewStyle } from 'react-native'
import React from 'react'
import { DefaultEventColor, EventColorsType } from '@/constants/EventColors'
import { formatEventTitle, loadThemeMap } from '@/utils/eventTools'
import { useState, useEffect } from 'react'
import { EventData, DAYS } from '../constants/EventTypes'
import Time from '@/constants/TimeClass'

interface EventBlockProps extends React.ComponentProps<typeof View> {
    data: EventData,
    theme?: EventColorsType,
    selectable?: boolean,
    selctCallback?: (id: number) => void,
    selected?: boolean
}

const days = [ 'MON', 'TUE', 'WED', 'THU', "FRI", 'SAT', 'SUN']

const findDimensions:(data: EventData) => ViewStyle = (data: EventData) => {
    let res:ViewStyle = {
        top: '0%',
        left: '0%',
        height: '0%'
    }

    // Left position
    let day = days.findIndex( (d) => d.toUpperCase() === data.day);
    if( day == -1){
        console.error("[findDimensions]: Invalid 'day' paramater -> " + data.day)
    }else{
        res.left = `${ (day*20) }%`
    }

    // normalising time
    let start = (data.startTime[0] - 8) + (data.startTime[1]/60)
    let end = (data.endTime[0] - 8) + (data.endTime[1]/60);

    // Top position
    if(start < 0)
        console.error("[findDimensions]: Invalid 'startTime' paramater -> " + data.startTime)
    if(end > 13)
        console.error("[findDimensions]: Invalid 'endTime' paramater -> " + data.endTime)

    res.top = `${100/13*start}%`

    // Height
    if(start >= end){
        console.error("[findDimensions]: Invalid 'startTime' and 'endTime' paramater -> " + data.startTime + " " + data.endTime)
        let tmp = start;
        start = end;
        end = tmp;
    }
    res.height = `${100/13*(end-start)}%`;

    return StyleSheet.flatten(res)

}



export default function EventBlock(props: EventBlockProps){
    const [theme, setTheme] = useState<EventColorsType>(DefaultEventColor)
    const shortTitle = props.data.shortTitle || formatEventTitle(props.data.title)

    const [previewVisible, setPreviewVisible] = useState(false)

    const toggleSelection = () => {
      if(props.selectable && props.selctCallback){
        // setSelected(!selected)
        // console.log("ress!")
        props.selctCallback(props.data.id);
      }
    }

    const togglePreview = () => {
        setPreviewVisible(!previewVisible)
    }

    useEffect(() => {
        if(props.theme){
            setTheme(props.theme)
        }        
    }, []);

      let pressableStyle:ViewStyle = props.selectable ? 
      {
        display: 'flex',
        padding: 0.4,
        borderWidth: 2,
        borderColor: props.selected ? '#3733ffef' : "#e7f1f8b0"
      } : { }

    return (
        <>

        { previewVisible &&
            <Modal 
            animationType="fade"
            transparent={true}
            visible={previewVisible}
            statusBarTranslucent
            style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
            onRequestClose={() => {}}
            >
                <Pressable 
                style={{backgroundColor: '#1116', position: 'absolute', top: 0, left: 0, right:0, bottom: 0 }} 
                onPress={() => setPreviewVisible(false)}/>

                <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={[ styles.eventModal, {backgroundColor: theme.background} ]} >
                        <Text style={[styles.ModalTitle, {color: theme.text, borderColor: theme.text}]}>{props.data.title}</Text>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Short Title:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>{props.data.shortTitle}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Location:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>{props.data.location}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Teacher:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>{props.data.teacher}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Group:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>{props.data.group || ' '}</Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Time:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>
                                {new Time(props.data.startTime).toString()} - {new Time(props.data.endTime).toString()}
                                </Text>
                        </View>

                        <View style={styles.modalRow}>
                            <Text style={[ styles.modalLabel, {color: theme.text}]}>Day:</Text>
                            <Text style={[ styles.modalValue, {color: theme.text, borderColor: theme.text}]}>{
                            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Unknown"].at( DAYS.indexOf(props.data.day) )
                            }</Text>
                        </View>


                        <View style={{backgroundColor: '#FFF2', height: '5%', width: '100%', borderColor: theme.text, borderTopWidth: 1}}></View>

                    </View>
                </View>
            </Modal>
        }

        <Pressable 
        onPress={(props.selectable) ? toggleSelection : togglePreview } 
        delayLongPress={350} 
        onLongPress={(props.selectable) ? togglePreview : () =>{} /* TODO: zIndex shifting for overlaping */ } 
        style={[styles.event, findDimensions(props.data), pressableStyle]}
        >
        <View style={ StyleSheet.flatten([
            {borderRadius: 4, flex: 1, overflow: 'hidden', padding: 1},
            {backgroundColor: theme.background, borderColor: theme.border}
            ]) }>
                <Text style={{color: theme.text}}>{shortTitle}</Text>
                <Text style={{fontSize: 10, color: theme.text, opacity: 0.5, padding: 1}}>{props.data.location}</Text>
                {
                props.data.group && props.data.group.length > 0 &&
                <Text style={{fontSize: 8, color: theme.text, opacity: 0.5, padding: 1}}>{props.data.group}</Text>
                }
            </View>
        </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    event: {
        textAlignVertical: 'center',

        overflow: 'hidden',

        width: '20%',
        position: 'absolute',

        borderRadius: 5,
        padding: 1.5,

        elevation: 2
    },

    eventModal: {
        width: '85%',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 30,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
    },
    ModalTitle: {
        fontSize: 20,
        width: '100%',
        paddingHorizontal: 40,
        paddingTop: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
        backgroundColor: '#FFF3',
    },
    modalRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        width: '80%',
    },
    modalLabel: {
        width: '40%',
        fontSize: 16,
        padding: 5,
    },
    modalValue: {
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: '#FFFFFF1F',
        borderTopLeftRadius:  5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius:  3,
        borderBottomRightRadius: 3,
        opacity: 0.9
    }
})