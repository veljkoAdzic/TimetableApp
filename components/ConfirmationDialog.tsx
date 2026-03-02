import React, {useState} from 'react'
import {Modal, View, Text, Pressable, StyleSheet, ColorValue, TextStyle } from 'react-native'
import Button from './Button'

export interface ConfirmationDialogStateType {visible: boolean, text: string}

interface ConfirmDialogProps {
    children: string, 
    OK: () => void, 
    OKtext?: string,
    OKstyle?: TextStyle,
    Cancel: () => void,
    CancelText?: string,
    CancelStyle?: TextStyle,
    Close?: () => void 
}

export const ConfirmationDialog = (props: ConfirmDialogProps) => {

    const finalCancelStyle:TextStyle = StyleSheet.flatten([styles.button, {backgroundColor: '#EB0000'}, props.CancelStyle]);
    const finalOKStyle:TextStyle = StyleSheet.flatten([styles.button, {backgroundColor: '#008000'}, props.OKstyle])

    return (
        <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={true}
        onRequestClose={() => {}}>

            <View style={styles.centeredView}>
                <Pressable
                style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
                onPress={() =>{
                    if(props.Close) 
                        props.Close() 
                    else 
                        props.Cancel()
                    } 
                }
                />
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{props.children}</Text>
                    
                    <View style={styles.btnContainer}>
                        <Button onPress={props.Cancel} buttonSyle={finalCancelStyle} pressStyle={{backgroundColor: '#F22'}}>{props.CancelText || "Cancel"}</Button>

                        <Button onPress={props.OK} buttonSyle={finalOKStyle} pressStyle={{backgroundColor: '#30A030'}} >{props.OKtext || "OK"}</Button>
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
        paddingHorizontal: 15,
        paddingVertical: 15,
        minWidth: 80,
        textAlign: 'center',
        borderRadius: 10,
        margin: 10,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 24,
    }
})