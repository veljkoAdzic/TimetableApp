import {View, Text, StyleSheet, Pressable, ActivityIndicator, Share, PermissionsAndroid, Platform} from 'react-native'
import React, {useState, useEffect, useCallback, useRef, forwardRef} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getCompressedData, encodeB94, SHARE_LINK_BASE } from '@/utils/encoding'
import { TextInput } from 'react-native-gesture-handler'
import * as Clipboard from 'expo-clipboard'
import { useFocusEffect } from 'expo-router'

export default function ShareScreen() {
    const [shareLink, setShareLink] = useState<string|null>(null)
    const [errMsg, setErrMsg] = useState<string|null>(null)

    useFocusEffect(
        useCallback(()=>{ // Memoising the function
            setShareLink(null)
            setErrMsg(null)

            getCompressedData()
            .then(arrBytes => {
                setShareLink(SHARE_LINK_BASE + encodeB94(arrBytes))
                setErrMsg(null)
            })
            .catch((e) => {
                setErrMsg(e instanceof Error ? e.message : String(e))
            })

            return () =>{} // must return function
        }, [])
        );
    
    // const btnColours = ["#8D80FF", "#6AB879", "#EC6D7A"]
    const btnColours = ["#6F66E2", "#489659", "#CE5362"]

    const handleLinkShare = async () => {
        try {
            if (shareLink == null) 
                throw "Link not ready!"

            const result = await Share.share({
                message: shareLink
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
        //   Alert.alert(error.message);
            setErrMsg(error.message)
        };
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>  
                <Text style={styles.label}>Share as link:</Text> 

                <View style={styles.btnGroup}>
                    <Pressable 
                    onPress={() => { if(shareLink) Clipboard.setStringAsync(shareLink) }}
                    style={[styles.btn, {backgroundColor: btnColours[0]}]}
                    > 
                    { ({pressed}) => (
                        <View style={[
                        styles.btnContent, 
                        pressed ? { backgroundColor: '#FFF3' }: {}
                    ]}>
                        <Text style={styles.btnText}>Copy</Text>

                        <MaterialCommunityIcons 
                        name="clipboard-outline" 
                        size={styles.btnText.fontSize + 7} 
                        color={styles.btnText.color}
                        />
                    </View>
                    ) }
                    </Pressable>

                    <Pressable 
                    onPress={handleLinkShare}
                    style={[styles.btn, {backgroundColor: btnColours[0]}]}
                    > 
                    { ({pressed}) => (
                        <View style={[
                        styles.btnContent, 
                        pressed ? { backgroundColor: '#FFF3' }: {}
                    ]}>
                        <Text style={styles.btnText}>Share</Text>

                        <MaterialCommunityIcons 
                        name="link-variant" 
                        size={styles.btnText.fontSize + 7} 
                        color={styles.btnText.color}
                        />
                    </View>
                    ) }
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Share as images:</Text>

                <View style={styles.btnGroup}>
                    <Pressable 
                    onPress={() => { /* TODO */}}
                    style={[styles.btn, {backgroundColor: btnColours[1]}]}
                    > 
                    { ({pressed}) => (
                        <View style={[
                        styles.btnContent, 
                        pressed ? { backgroundColor: '#FFF3' }: {}
                    ]}>
                        <Text style={styles.btnText}>Save</Text>

                        <MaterialCommunityIcons 
                        name="download" 
                        size={styles.btnText.fontSize + 7} 
                        color={styles.btnText.color}
                        />
                    </View>
                    ) }
                    </Pressable>

                    <Pressable 
                    onPress={() => { /* TODO */}}
                    style={[styles.btn, {backgroundColor: btnColours[1]}]}
                    > 
                    { ({pressed}) => (
                        <View style={[
                        styles.btnContent, 
                        pressed ? { backgroundColor: '#FFF3' }: {}
                    ]}>
                        <Text style={styles.btnText}>Share</Text>

                        <MaterialCommunityIcons 
                        name="image-move" 
                        size={styles.btnText.fontSize + 7} 
                        color={styles.btnText.color}
                        />
                    </View>
                    ) }
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Share as file:</Text> 
                
                <View style={styles.btnGroup}>

                <Pressable 
                onPress={() => { /* TODO */}}
                style={[styles.btn, {backgroundColor: btnColours[2]}]}
                > 
                { ({pressed}) => (
                    <View style={[
                        styles.btnContent, 
                        pressed ? { backgroundColor: '#FFF3' }: {}
                    ]}>
                        <Text style={styles.btnText}>Export</Text>

                        <MaterialCommunityIcons 
                        name="file-move" 
                        size={styles.btnText.fontSize + 7} 
                        color={styles.btnText.color}
                        />
                    </View>
                ) } 
                </Pressable>

                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 40,
        paddingTop: -100,
        gap: 60,
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

    section: {
        width: '100%', 
        alignItems: 'center', 
        gap: 10,

        // paddingBottom: 20,
        // borderBottomWidth: 1,
        // borderColor: '#dadada'
    },

    shareLinkContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        gap: 10,
    },
    label: {
        width: '100%', 
        fontSize: 30,
        color: '#6c6288',
        paddingLeft: 10
    },

    loaderWrapper: {
        justifyContent: 'center', 
        backgroundColor: "#ededed",
        width: '100%', 
        padding: 5, 
        borderRadius: 10
    },

    btnGroup: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        gap: 20
    },

    btn: {
        overflow: 'hidden', 
        borderRadius: 10, 
        backgroundColor: '#4872e6', 
        elevation: 3, 
        flexGrow: 1,
        maxWidth: '60%'
    },

    btnContent: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-evenly', 
        padding: 7, 
        gap: 10,
    },

    btnPress: {
        backgroundColor: '#FFF3'
    },

    btnText: {
        color:'#EAEAEA', 
        fontSize: 22
    },
})
