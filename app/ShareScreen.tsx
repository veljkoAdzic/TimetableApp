import {View, Text, StyleSheet, Pressable} from 'react-native'
import {useState, useEffect} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function ShareScreen() {
    const OPTIONS = [
    {
        iconName: 'image-move',
        text: 'Share as image'
    },
    {
        iconName: 'qrcode',
        text: 'Share as QR code'
    },
    {
        iconName: 'link',
        text: 'Share as URL'
    },
    {
        iconName: 'file-download',
        text: 'Export as file'
    },
    ]

    const [selected, setSelected] = useState(0)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Share or export timetable</Text>

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


            { selected == 0 && /* EXPORT AS IMAGE */
                <View style={styles.mainContainer}>
                    <Text>IMG</Text>
                </View>
            }

            { selected == 1 && /* QR CODE */
                <View style={{backgroundColor: 'salmon', width: '100%', flexGrow: 1}}>
                    <Text>QR</Text>
                </View>
            }

            { selected == 2 && /* SHARE LINK */
                <View style={{backgroundColor: 'salmon', width: '100%', flexGrow: 1}}>
                    <Text>LINK</Text>
                </View>
            }

            { selected == 3 && /* EXPORT AS FILE */
                <View style={{backgroundColor: 'salmon', width: '100%', flexGrow: 1}}>
                    <Text>FILE</Text>
                </View>
            }
            

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
        backgroundColor: 'salmon', 
        width: '100%', 
        flexGrow: 1,
        
    },
})
