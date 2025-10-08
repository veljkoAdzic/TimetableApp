import {View, Pressable, Modal, StyleSheet } from 'react-native'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Form from './Form'
import { useState, useEffect } from 'react'
import { EventData, DefaultEventData } from '@/constants/EventTypes'
import { EventColorsType, DefaultEventColor, EventColors } from '@/constants/EventColors'

export default function ItemEditModal(props: {data: EventData | null, ThemeMap: Map<string, EventColorsType>, editCallback: (data: EventData, id: number) => void, deleteCallback: (id: number) => void, closeCallback:(final: EventData | null) => void}) {
    const [cdVisible, setCDvisible] = useState(false);
    const [data, setData] = useState<EventData>(DefaultEventData);
    const [theme, setTheme] = useState<EventColorsType>(DefaultEventColor)

    useEffect(() => {
        if (props.data) {
            setData(props.data); 
        }
    }, [props.data]);

    useEffect(() =>{
        if(data.location.length == 0) return

        if (!props.ThemeMap.has(data.location)){
            const index = props.ThemeMap.size % EventColors.length
            props.ThemeMap.set(data.location, EventColors[index])
        }
        setTheme({...props.ThemeMap.get(data.location)!})
    }, [data.location, props.ThemeMap])


    function setEdits(edited: EventData){ // callback for form editing
        if(edited.location.length != 0) {
            if (!props.ThemeMap.has(edited.location)){
                const index = props.ThemeMap.size % EventColors.length
                props.ThemeMap.set(edited.location, EventColors[index])        
            }
            setTheme({...props.ThemeMap.get(edited.location)!})
        }

        setData(edited);
        props.editCallback(edited, edited.id);
    }

    return (
        <>        
        { cdVisible ?
            <ConfirmationDialog
            OK={()=>{
                setCDvisible(false)
                // setEdits(props.data!)
                props.deleteCallback(data.id)
                props.closeCallback(null)
            }}
            OKtext="Delete"
            Cancel={()=>{ setCDvisible(false) }}>
                Are you sure you want to delete this class?
            </ConfirmationDialog>
            : <></>
        }

        <Modal
        animationType="fade"
        transparent={true}
        visible={!!props.data}
        style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0 }}
        statusBarTranslucent={true}
        onRequestClose={() => {
            props.editCallback(data, data.id);
            props.closeCallback(data)
        }}
        >
        <View style={styles.centeredView}>
            <Pressable
            style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
            onPress={() => {
                props.closeCallback(data)
            }}
            />

            <View style={[styles.modalView, {backgroundColor: theme.background, borderColor: theme.border}]}>

            <Form data={data ?? DefaultEventData } theme={theme} editCallback={setEdits} />

            <View style={styles.editBar}>
                <Pressable
                onPress={() =>{ setEdits(data); props.closeCallback(data)  }}
                style={styles.editBarButton}
                >
                    <MaterialCommunityIcons name="content-save" size={28} color={theme.text} />
                </Pressable>
                
                <Pressable
                onPress={() =>{ setCDvisible(true) }}
                style={styles.editBarButton}
                >
                    <MaterialCommunityIcons name="delete" size={28} color={theme.text} />
                </Pressable>
            </View>

            </View>
        </View>
        </Modal>

        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0008',
        paddingBottom: "10%",
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 0,//35,
        paddingBottom: 0,
        alignItems: 'center',
        elevation: 5,
        width: "80%",
    },
    editBar: {
        paddingVertical: 5,
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-around',
        backgroundColor: '#FFF3',
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopWidth: 1,
    },
    editBarButton: {
        padding: 10,
    }
})