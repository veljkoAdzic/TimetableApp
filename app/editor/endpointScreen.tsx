import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { getClassList  } from '../../utils/timetableData'
import { useRouter } from 'expo-router'
import Button from '@/components/Button'
import { decodeB94, decompressData } from '@/utils/encoding'

enum loaderStates {
    inactive,
    active,
    finished,
    failed
}

export default function EndpointScreen() {
    const [inputValue, setInputValue] = useState('')
    const [loader, setLoader] = useState(loaderStates.inactive)
    const router = useRouter()
    const [loaderTimer, setLoaderTimer] = useState<number | undefined>()

    const handleButtonPress = async () =>{
        if(inputValue.length == 0) return

        // disable button
        if (loader == loaderStates.active)
            return

        if(loaderTimer){
            clearTimeout(loaderTimer)
            setLoaderTimer(undefined)
        }
        setLoader(loaderStates.active)

        if(inputValue.startsWith('ttshare://tt.app/data/')){

            let encoded_data = inputValue.slice('ttshare://tt.app/data/'.length)
            try {
                let decoded = decodeB94(encoded_data)
                if(decoded == null)
                    throw new Error("Unable to decode")

                let unzipped = decompressData(decoded) // Full Async Storage as JSON

                // console.log(unzipped)
                
                router.push({pathname:'/editor/downloaderScreen', params: {sharelink: unzipped, previewMode: 1}})

                setLoader(loaderStates.finished)
            } catch (e) {
                console.log("ERRor: " + e)
                setLoader(loaderStates.failed)
            }
            return;
        }

        getClassList(inputValue)
        .then((classes) => {
            if(classes.length == 0) 
                throw "Error"; 
            
            classes.sort( (a, b) => a.label.trim().localeCompare(b.label.trim()) )
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
            placeholderTextColor={'#666'}
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
            
            <View style={{display: 'flex', flexDirection: 'row', gap: 35}}>
                <Button 
                onPress={() => { router.back() }} 
                buttonSyle={StyleSheet.flatten([styles.button, {backgroundColor: '#9fc8ee'}])} 
                pressStyle={{backgroundColor: '#bad3eb', color: '#222'}}
                >
                    Back
                </Button>

                
                <Button 
                onPress={ () => {handleButtonPress()} }
                buttonSyle={StyleSheet.flatten([styles.button, styles.buttonPassive])} 
                pressStyle={styles.buttonActive}
                disabled={loader == loaderStates.active}
                >
                    Get Timetable
                </Button>
            </View>
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
        backgroundColor: '#F5F5F5',
        color: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '75%',
        elevation: 3
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