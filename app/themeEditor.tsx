import { View, Text, FlatList, StyleSheet } from 'react-native'
import {useCallback, useEffect, useState} from 'react'
import { EventColorsType } from '@/constants/EventColors'
import { loadThemeMap } from '@/utils/eventTools'
import { useFocusEffect } from 'expo-router'
import { DEVELOPER_MODE } from '@/constants/Settings'

function ThemeEntry(props:{text: string, theme:EventColorsType}){

    return (
    <View style={styles.themeEntryContainer}>
        <Text style={styles.themeEntryText}>{props.text}</Text>
        
        <View style={[styles.themePreviewMain, {backgroundColor: props.theme.background}]}>
            <View style={[styles.themePreviewSecondary, {backgroundColor: props.theme.text}]} />
        </View>
    </View>
    )
}


export default function themeEditor() {
    const [themeMap, setThemeMap] = useState<Map<string, EventColorsType> | null>(null)

    useFocusEffect(
        useCallback(()=>{ // Memoising the function
            
            // Load theme from async storage
            const tmp = new Map<string, EventColorsType>()
            loadThemeMap(tmp)
            .then(()=>{
                setThemeMap(tmp)
            })
            .catch(() =>{
                if(DEVELOPER_MODE)
                    console.error("[themeEditor>useFocusEffect]: failed to load ThemeMap!")
            })
            
    
            return () =>{} // must return function
    
        }, [])
    );

    if (themeMap == null) {
        return(
            <Text>Loading...</Text>
        )
    }

    return (

        <FlatList style={styles.scrollContainer} contentContainerStyle={styles.elementsContainer}
        data={[...themeMap]}
        initialNumToRender={9}
        renderItem={ ({item, index}) => 
            <ThemeEntry key={index} text={item[0]} theme={item[1]} />
         } 
        />
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    elementsContainer: {
        // paddingBottom: 100, 
        gap: 15, 
        padding: 20
    },

    themeEntryContainer: {
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        padding: 20,
        paddingLeft: 30,
        elevation: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeEntryText: {
        fontSize: 18,
        verticalAlign: 'middle'
    },
    themePreviewMain: {
        height: 40,
        aspectRatio: 1/1,
        borderRadius: '50%',
        overflow: 'hidden',
        elevation: 3,
    },
    themePreviewSecondary: {
        width: '150%',
        aspectRatio: 1/1,
        margin: '35%',
        transform: [{rotateZ: '45deg'}],

        borderColor: '#d3d3d3d3',
        borderWidth: 2.5,
    }
})