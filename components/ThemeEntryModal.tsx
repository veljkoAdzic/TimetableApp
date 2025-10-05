import {View, Text, Modal, StyleSheet, Pressable } from 'react-native'
import {ThemeEditingContext} from '@/constants/Contexts'
import { useContext, useState } from 'react'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

function ColourButton(props:{theme: EventColorsType, onClick:() => void}){

    return (
        <Pressable onPress={() => {           
                props.onClick()
            } } 
        style={{padding: 2, borderRadius: '50%', borderWidth: 1, borderColor: '#DDD'}} 
        >
            <View style={[styles.themeButtonMain, {backgroundColor: props.theme.background}]}>
                <View style={[styles.themeButtonSecondary, {backgroundColor: props.theme.text}]} />
            </View>
        </Pressable>
    )
}

export default function ThemeEntryModal(){
    const {entry, setEntry, saveChanges} = useContext(ThemeEditingContext)

    if (entry == null){
        return <></>
    }

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={entry != null}
        onRequestClose={() => {}}>
            <View style={styles.centeredView}>
                <Pressable
                style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
                onPress={() =>{ saveChanges(entry); setEntry(null) } 
                }
                />

                <View style={styles.modalView}>
                    <Text style={styles.title}>
                        {entry[0]}
                    </Text>

                    <View style={[styles.previewBlock, {backgroundColor: entry[1].background, borderColor: entry[1].border}]}>
                        <Text style={{color: entry[1].text}}>Title</Text>
                        <Text style={{color: entry[1].text, fontSize:10, opacity: 0.5}}>Sub Text 1</Text>
                        <Text style={{color: entry[1].text, fontSize: 9, opacity: 0.5}}>Sub Text 2</Text>
                    </View>

                    <View></View>

                    <View style={styles.coloursContainer}>
                    {
                        EventColors.map( (colours, index) => {
                            if (index >= 9) return <></>

                            return (
                                <ColourButton key={index} theme={colours} onClick={() => { setEntry([entry[0], colours]) } } />
                            )
                        }
                        )
                    }
                    </View>

                    <View style={styles.editBar}>
                        <Pressable
                        onPress={() =>{ saveChanges(entry); setEntry(null); }}
                        style={styles.editBarButton}
                        >
                            <MaterialCommunityIcons name="content-save" size={28} color={'#151515'} />
                        </Pressable>
                        
                        <Pressable
                        onPress={() =>{ setEntry(null); }}
                        style={styles.editBarButton}
                        >
                            <MaterialCommunityIcons name="delete" size={28} color={'#151515'} />
                        </Pressable>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
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
        paddingBottom: 5,
        alignItems: 'center',
        elevation: 5,
        width: "80%",
        gap: 15,
    },
    title: {
        width: '100%', 
        fontSize: 18, 
        borderBottomColor: '#111', 
        borderBottomWidth: 1, 
        paddingLeft: 5, 
    },
    previewBlock: {
        padding: 2,
        borderWidth: 1,
        borderRadius: 6,
        minWidth: 80,
        minHeight: 80,
    },

    coloursContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        width: '85%', 
        justifyContent: 'space-between', 
        gap: 25
    },

    themeButtonMain: {
        height: 40,
        aspectRatio: 1/1,
        borderRadius: '50%',
        overflow: 'hidden',
        elevation: 3,
    },
    themeButtonSecondary: {
        width: '150%',
        aspectRatio: 1/1,
        margin: '35%',
        transform: [{rotateZ: '45deg'}],

        borderColor: '#d4d4d4d3',
        borderWidth: 2.5,
    },

    editBar: {
        paddingVertical: 5,
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-around',
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#151515'
    },
    editBarButton: {
        padding: 10,
    }
})