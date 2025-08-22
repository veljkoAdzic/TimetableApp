import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { getClassList  } from '../../utils/timetableData'
import { useRouter } from 'expo-router'

enum loaderStates {
    inactive,
    active,
    finished,
    failed
}

export default function EndpointScreen() {
    const [inputValue, setInputValue] = useState('http://192.168.100.18:369/api')  // TMP !!!!
    const [loader, setLoader] = useState(loaderStates.inactive)
    const router = useRouter()
    const [loaderTimer, setLoaderTimer] = useState<number | undefined>()

    const handleButtonPress = async () =>{
        // disable button
        if (loader == loaderStates.active)
            return

        if(loaderTimer){
            clearTimeout(loaderTimer)
            setLoaderTimer(undefined)
        }
        setLoader(loaderStates.active)

        getClassList(inputValue)
        .then((classes) => {
            if(classes.length == 0) 
                throw "Error"; 

            classes.sort((a, b) => a.label.localeCompare(b.label))
            setLoader(loaderStates.finished)
            router.push({pathname:'/editor/downloaderScreen', params: {classesList: JSON.stringify(classes), URL: inputValue}})
        })
        .catch((err) => {
            setLoader(loaderStates.failed)
            
        })
        .finally(() => {
            setLoaderTimer( 
                setTimeout(() => {
                    setLoader(loaderStates.inactive)
                }, 15000) 
            )
        })
    }

    return (
        <View style={styles.container} >

            <Text style={styles.title}>Input API or share link</Text>

            <TextInput 
            placeholder='link to timetable' 
            inputMode='url' 
            style={styles.input}
            onChangeText={ (nextTxt) => setInputValue(nextTxt.trim()) }
            value={inputValue}
             />
            
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15}}>
                {
                    loader == loaderStates.active &&
                    <ActivityIndicator color="#7d56d8ff" />
                }

                <Text>{ 
                (loader == loaderStates.inactive) ? "" : 
                (loader == loaderStates.active) ? "Loading..." : 
                (loader == loaderStates.finished) ? "Finished!" :
                "Failed :(" 
                }</Text>
            </View>
            
            <Pressable onPress={ handleButtonPress } >
                { ({pressed}) =>
                <Text 
                style={[styles.button, 
                (pressed || loader == loaderStates.active) ? 
                styles.buttonActive : 
                styles.buttonPassive]}
                >
                    Get Timetable
                </Text>
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
        paddingTop: "15%"
    },
    input: {
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '75%'
    },

    title: {
        textAlign: 'center', 
        fontSize: 25, 
        paddingVertical: 10,
        paddingBottom: 40
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