import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import { getData  } from '../utils/timetableData'
export default function EditorScreen() {
    const [inputValue, setInputValue] = useState('')

    return (
        <View style={styles.container} >
            <TextInput 
            placeholder='http://192.168.100.18:3000/api/' 
            inputMode='url' 
            style={styles.input}
            onChangeText={ (nextTxt) => setInputValue(nextTxt) }
             />
            <Pressable 
            onPressOut={() =>{
                console.log("Pressed Button")
                getData(inputValue.trim() || 'http://192.168.100.18:3000/api/')
            }}
            >
                { ({pressed}) =>
                <Text style={[styles.button, (pressed) ? styles.buttonActive : styles.buttonPassive]}>Check DB</Text>
                }
            </Pressable>
        </View>
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