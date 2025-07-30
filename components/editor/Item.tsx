import { useEffect, useState } from "react";
import { EventData} from "@/constants/EventTypes";
import { EventColors, EventColorsType, DefaultEventColor } from "@/constants/EventColors";
import { Pressable, View, Text, Modal, StyleSheet } from "react-native";
import Form from "./Form";
import { ConfirmationDialog } from "../ConfirmationDialog";
import {MaterialCommunityIcons} from '@expo/vector-icons'

export default function Item(props: {data: EventData, ThemeMap: Map<string, EventColorsType>, editCallback: (data: EventData, id: number) => void, deleteCallback: (id: number) => void, opened?: boolean}) {
    const [data, setData] = useState(props.data)
    const [modalVisible, setModalVisible] = useState(props.opened || false);
    const [cdVisible, setCDvisible] = useState(false);
    const [theme, setTheme] = useState<EventColorsType>(DefaultEventColor)

    useEffect(() =>{
        if(data.location.length == 0) return

        if (!props.ThemeMap.has(data.location)){
            const index = props.ThemeMap.size % EventColors.length
            props.ThemeMap.set(data.location, EventColors[index])
        }
        setTheme({...props.ThemeMap.get(data.location)!})
    }, [])

    function setEdits(edited: EventData){ // callback for form editing
        if(edited.location.length != 0) {
            if (!props.ThemeMap.has(edited.location)){
                const index = props.ThemeMap.size % EventColors.length
                props.ThemeMap.set(edited.location, EventColors[index])        
            }
            setTheme({...props.ThemeMap.get(edited.location)!})
        }

        if(edited.day == data.day)
            props.editCallback(edited, edited.id);
        
        setData(edited)
    }

    return(
        <>
        <Pressable
        // style={{backgroundColor: '#FFE9E9', padding: 15, borderRadius: 10, marginRight: 20}}
        onPress={() => setModalVisible(true)}>
            <View style={[styles.item, {backgroundColor: theme.background, borderColor: theme.border}]}>
                <Text style={{color:theme.text}}>{data.shortTitle}</Text>
                <Text style={{color: theme.text, opacity: 0.6, fontSize: 10}}>{data.location}</Text>
            </View>
        </Pressable>
        
        { cdVisible ?
        <ConfirmationDialog
        OK={()=>{
            setCDvisible(false)
            setEdits(data)
            props.deleteCallback(data.id)
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
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
            props.editCallback(data, data.id);
        }}
        >
        <View style={styles.centeredView}>
            <Pressable
            style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
            onPress={() => {
                setModalVisible(false)
                setEdits(data)
                //props.editCallback(data,props.index)
            }}
            />

            <View style={[styles.modalView, {backgroundColor: theme.background, borderColor: theme.border}]}>

            <Form data={data} theme={theme} editCallback={setEdits} />

            <View style={styles.editBar}>
                <Pressable
                onPress={() =>{ setEdits(data); setModalVisible(false);  }}
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
    item: {
        backgroundColor: 'orange',
        height: 110,
        aspectRatio: 6/8,
        borderRadius: 5
    },

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