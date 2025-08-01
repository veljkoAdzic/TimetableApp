import { View, Text, StyleSheet, Pressable, Animated, Easing } from "react-native"
import { router } from "expo-router"
import { useState, useRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function EditorButtons(props: { editButtonFunction: () => void}){
    const rotation = useRef(new Animated.Value(0)).current;
    const editY  = useRef(new Animated.Value(0)).current;
    const downloadY  = useRef(new Animated.Value(0)).current;
    const [open, setOpen] = useState(false);

    const rotateTo = (toValue: number) => {
        Animated.timing( rotation, {
            toValue,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }
    const moveEdit = (toValue: number) => {
        Animated.timing( editY, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }
    const moveDownload = (toValue: number) => {
        Animated.timing( downloadY, {
            toValue,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }

    const toggleOpening = () => {
        rotateTo(open ? 0 : 1)
        moveDownload(open ? 0 : 1)
        moveEdit(open ? 0 : 1)
        setOpen(!open)
    }
    const editStyle = {
        transform: [{
            "translateY": editY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -155]
            })
        }]
    }
    const downloadStyle = {
        transform: [{
            "translateY": downloadY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -85]
            })
        }]
    }
    const rotationStyle = {
        transform: [{
            "rotate": rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg']
            })
        }]
    }

    return(
        <>
        {open ? 
        <Pressable style={styles.cancelArea} onPress={toggleOpening} /> :
        <></>
        }

        <View style={styles.container}>
            <View style={styles.buttonContainer}>

                <Animated.View style={[styles.button, editStyle]}>
                    <Pressable style={{padding: 10}}
                    onPress={() => { toggleOpening(); props.editButtonFunction(); }}>
                        <MaterialCommunityIcons name="pencil-plus" size={40} color='#eee' />
                    </Pressable>
                </Animated.View>
               
                <Animated.View style={[styles.button, downloadStyle]}>
                    <Pressable style={{padding: 10}}
                    onPress={() => { toggleOpening(); router.push("/editor/endpointScreen") }}>
                        <MaterialCommunityIcons name="cloud-download" size={40} color='#eee' />
                    </Pressable>
                </Animated.View> 
                    

                <Animated.View style={[styles.button, rotationStyle, open ?  {backgroundColor: '#2f3646ff'}:{} ]}>
                    <Pressable style={{padding: 10}}
                    onPress={toggleOpening}>
                        <MaterialCommunityIcons name="plus" size={50} color='#eee' />
                    </Pressable>
                </Animated.View>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        bottom: 30,
    },
    buttonContainer: {
        position: 'relative',
        alignItems: 'center',
        width: 110,
    },
    button :{
        borderRadius: "50%",
        backgroundColor: '#212631',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1/1,
        position: 'absolute',
        bottom: 0
    },
    cancelArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})