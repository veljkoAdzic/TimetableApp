import React, {useState} from 'react'
import {Modal, View, Text, Pressable, StyleSheet, ColorValue, TextStyle } from 'react-native'

export interface ConfirmationDialogStateType {visible: boolean, text: string}

interface ConfirmDialogProps {
    children: string, 
    OK: () => void, 
    OKtext?: string,
    OKstyle?: TextStyle,
    Cancel: () => void,
    CancelText?: string,
    CancelStyle?: TextStyle,
}

export const ConfirmationDialog = (props: ConfirmDialogProps) => {
    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}>

            <View style={styles.centeredView}>
                <Pressable
                style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
                onPress={() =>{props.Cancel()}}
                />
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{props.children}</Text>
                    
                    <View style={styles.btnContainer}>
                        <Pressable style={{padding: 10}}
                            onPress={() => { props.Cancel()  }}>
                                <Text style={props.CancelStyle || [styles.button, {backgroundColor: 'red'}]}>
                                    {props.CancelText || "Cancel"}
                                    </Text>
                        </Pressable>
                        <Pressable style={{padding: 10}}
                            onPress={() => { props.OK()  }}>
                                <Text style={props.OKstyle || [styles.button, {backgroundColor: 'green'}]}>
                                    {props.OKtext || "OK"}
                                    </Text>
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
        alignItems: 'center',
        elevation: 5,
        width: "80%"
    },
    modalText: {
        fontSize: 24,
        textAlign: 'center',
    },
    button: {
        fontSize: 19,
        color: 'white',
        padding: 15,
        minWidth: 80,
        textAlign: 'center',
        borderRadius: 10,
        
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'baseline',
        width: '100%',
        marginTop: 24,
    }
})