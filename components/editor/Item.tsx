import { useState } from "react";
import { EventData} from "@/constants/EventTypes";
import { EventColors, EventColorsType } from "@/constants/EventColors";
import { Pressable, View, Text, Modal, StyleSheet } from "react-native";
import Form from "./Form";


export default function Item(props: {data: EventData, ThemeMap: Map<string, EventColorsType>, editCallback: (data: EventData, id: number) => void}) {
    const [data, setData] = useState(props.data)
    const [modalVisible, setModalVisible] = useState(false);
    const [theme, setTheme] = useState<EventColorsType>({...props.ThemeMap.get(data.location)!})

    function setEdits(edited: EventData){ // callback for form editing
        setData(edited)

        if (!props.ThemeMap.has(edited.location)){
            const index = props.ThemeMap.size % EventColors.length
            props.ThemeMap.set(data.location, EventColors[index])
        }
        setTheme({...props.ThemeMap.get(data.location)!})

        props.editCallback(data, data.id);
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
        

        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
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

            <Form data={data} editCallback={setEdits} />

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
        backgroundColor: '#0008'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        width: "80%"
    },
})