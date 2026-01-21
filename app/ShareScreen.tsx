import {View, Text, StyleSheet, Pressable, ActivityIndicator} from 'react-native'
import {useState, useEffect, useCallback} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getCompressedData, encodeB94 } from '@/utils/encoding'
// import QRCode from 'react-native-qrcode-svg'
import { TextInput } from 'react-native-gesture-handler'
import * as Clipboard from 'expo-clipboard'
import { useFocusEffect } from 'expo-router'

export default function ShareScreen() {
    const OPTIONS = [
    {
        iconName: 'image-move',
        text: 'Share as image'
    },
    {
        iconName: 'qrcode',
        text: 'Share as QR code or link'
    },
    // {
    //     iconName: 'link',
    //     text: 'Share as URL'
    // },
    {
        iconName: 'file-download',
        text: 'Export as file'
    },
    ]

    useFocusEffect(
        useCallback(()=>{ // Memoising the function
            setQRdata(null)
            setShareLink(null)
            setErrMsg(null)
            setSelected(0)
            
            return () =>{} // must return function
    
        }, [])
        );

    const [selected, setSelected] = useState(0)

    const [errMsg, setErrMsg] = useState<string|null>(null)

    const [QRdata, setQRdata] = useState<string|null>(null)
    const [shareLink, setShareLink] = useState<string|null>(null)


    useEffect(() => {
        if(selected == 1 && QRdata == null && shareLink == null) {
            getCompressedData()
            .then(arrBytes => {
                const parts: string[] = new Array(arrBytes.length)
                for( let i = 0; i < arrBytes.length; i++){
                    parts[i] = String.fromCharCode(arrBytes[i])
                }
                setShareLink('ttshare://tt.app/data/' + encodeB94(arrBytes))
                setErrMsg(null)
            })
            .catch((e) => {
                setErrMsg(e instanceof Error ? e.message : String(e))
            })
            
        }
    }, [selected])


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{OPTIONS[selected].text}</Text>

            { selected == 0 && errMsg == null && /* EXPORT AS IMAGE */
                <View style={[{backgroundColor: 'lime'}, styles.mainContainer]}>
                    <Text>IMG</Text>
                </View>
            }

            { selected == 1 && errMsg == null && /* QR CODE */
                <View style={styles.mainContainer}>                    
                    { (QRdata == null && shareLink == null) ?
                    <View style={{flex: 1, justifyContent: 'center'}}> 
                        <ActivityIndicator color="#6139cf" size={50} /> 
                    </View> :
                    <>
                    <View style={{borderRadius: 15, overflow: 'hidden', elevation: 5}}>
                    {/* <QRCode value={QRdata!} size={310} ecl='L' quietZone={20} /> */}
                    </View>

                    <View style={styles.shareLinkContainer}>
                        <TextInput 
                        style={{backgroundColor: '#FFF', color: '#555', borderRadius: 10, padding: 10, flexShrink: 1, elevation: 3, borderWidth: 1, borderColor: '#1113' }}
                        value={shareLink || ''}
                        scrollEnabled
                        selection={{start: 0}}
                        editable={false}
                                            
                        />
                        <Pressable 
                        onPress={() => { if(shareLink) Clipboard.setStringAsync(shareLink) }}
                        style={{overflow: 'hidden', borderRadius: '30%', backgroundColor: '#555ee4ff', elevation: 3}}
                        > 
                        { ({pressed}) => (
                            <MaterialCommunityIcons 
                            name="clipboard-outline" 
                            size={32} 
                            color='#EAEAEA' 
                            style={[{padding: 5}, pressed ? { backgroundColor: '#FFF3' }: {}]} 
                            />
                        ) } 
                        </Pressable>
                    </View>
                    </>
                    }
                </View>
            }

            { selected == 2 && errMsg == null && /* EXPORT AS FILE */
                <View style={[{backgroundColor: 'yellow'}, styles.mainContainer]}>
                    <Text>FILE</Text>
                </View>
            }


            { errMsg != null &&
                <View style={[{backgroundColor: 'pink'}, styles.mainContainer]}>
                    <Text>{errMsg}</Text>
                </View>
            }

            <View style={styles.optionsContainer}>

                {OPTIONS.map((val, i) => (
                    <Pressable key={i} style={{padding: 5}} 
                    onPress={() => {setSelected(i)}} >
                        { ({pressed}) => (
                        <View style={[styles.optionsItem, (i==selected && styles.optionsItemSelected), (pressed && {})]}>
                            <MaterialCommunityIcons 
                            name={val.iconName} 
                            size={30} 
                            color={(i == selected) ? "#FFF" : "#111"} 
                            style={[
                                {padding: 15}, 
                                (pressed) && {backgroundColor: ((i==selected) ? '#FFF3' : '#4442')}
                            ]} />
                        </View>
                        )
                        }
                    </Pressable>
                )) }
            </View>
            

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 40,
        gap: 30,
    },

    title: {
        fontSize: 25,
        paddingTop: 20,
        textAlign: 'center',
    },

    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionsItem: {
        backgroundColor: '#F0F0F0',
        // padding: 15,
        borderRadius: '49%',
        elevation: 4,
        overflow: 'hidden',
    },

    optionsItemSelected: {
        backgroundColor: '#6139cf',
        borderRadius: '45%',
        elevation: 7
    },

    mainContainer: {
        width: '100%', 
        flexGrow: 1, 
        alignItems: 'center', 
        gap: 40
    },

    shareLinkContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        gap: 10,
    },
})
