import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import { getClassList  } from '../../utils/timetableData'

enum loaderStates {
    inactive,
    active,
    finished
}

export default function EndpointScreen() {
    const [inputValue, setInputValue] = useState('http://192.168.100.18:369/api')  
    const [loader, setLoader] = useState(loaderStates.inactive)

    return (
        <View style={styles.container} >
            <TextInput 
            placeholder='API endpoint' 
            inputMode='url' 
            style={styles.input}
            onChangeText={ (nextTxt) => setInputValue(nextTxt.trim()) }
            value={inputValue}
             />
            
            <Text>{ 
                (loader == loaderStates.inactive) ? "" : 
                (loader == loaderStates.active) ? "Loading..." : 
                "Finished :D" 
            }</Text>
            
            <Pressable 
            onPress={ async () =>{
                setLoader(loaderStates.active)
                getClassList(inputValue)
                .then((classes) => {
                    classes.sort((a, b) => a.label.localeCompare(b.label))
                    for (let c of classes){
                        console.log(c.value, c.label)
                    }
                    setLoader(loaderStates.finished)
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