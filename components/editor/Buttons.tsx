import { View, Text, StyleSheet, Pressable } from "react-native"
import { router } from "expo-router"
export default function EditorButtons(){
    return(
        <View style={styles.container}>
            <View>
                <Pressable style={{padding: 10}}
                    onPress={() => { router.push('/editor/downloader')  }}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>+</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: '0%',
        bottom: '0%',
        padding: 20
    },

    button :{
        width: 60, 
        height: 60, 
        borderRadius: "50%", 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#212631'
    }, 
    buttonText: {
        lineHeight: 65, 
        fontSize: 60,
        fontFamily: "monospace",
        color: '#eee', 
        
    }
})