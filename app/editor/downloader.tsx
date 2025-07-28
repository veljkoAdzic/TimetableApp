import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import { getClassList  } from '../../utils/timetableData'
import EndpointScreen from '@/screens/downloader/edpointScreen'

export default function EditorScreen() {
    return (
        <EndpointScreen />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 50,
        paddingTop: "25%"
    },
    input: {
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '75%'
    },

    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        fontSize: 16
    },
    buttonPassive: { backgroundColor: "#80B1FF" },
    buttonActive: { backgroundColor: "#A0D1FF" }
})