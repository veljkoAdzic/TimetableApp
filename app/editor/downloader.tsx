import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import { isVersionUpToDate  } from '../../utils/timetableData'
import { loadData } from '@/utils/localStorage'

export default function EditorScreen() {
    const [inputValue, setInputValue] = useState('')

    enum loaderStates {
        inactive,
        active,
        finished
    }
    const [loader, setLoader] = useState(loaderStates.inactive)
    return (
        <View style={styles.container} >
            <TextInput 
            placeholder='http://192.168.100.18:3000/api' 
            inputMode='url' 
            style={styles.input}
            onChangeText={ (nextTxt) => setInputValue(nextTxt.trim()) }
             />
            
            <Text>{ 
                (loader == loaderStates.inactive) ? "" : 
                (loader == loaderStates.active) ? "Loading..." : 
                "Finished :D" 
            }</Text>
            
            <Pressable 
            onPress={ () =>{
                setLoader(loaderStates.active)
                isVersionUpToDate(inputValue)
                .then(utd => {
                    console.log('[Pressable]: ' + utd)
                    setTimeout( () => setLoader(loaderStates.finished), 500)
                    if(utd){
                        //local data is up to date
                    } else {
                        // update data 
                    }
                })
            } }
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