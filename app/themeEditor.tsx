import { View, Text, FlatList, StyleSheet, Pressable, Modal } from 'react-native'
import {useCallback, useState, createContext, useContext} from 'react'
import { DefaultEventColor, EventColorsType } from '@/constants/EventColors'
import { loadThemeMap } from '@/utils/eventTools'
import { useFocusEffect } from 'expo-router'
import { DEVELOPER_MODE } from '@/constants/Settings'
import Button from '@/components/Button'
import { loadData } from '@/utils/localStorage'
import { EventData } from '@/constants/EventTypes'
import ThemeEntryModal from '@/components/ThemeEntryModal'
import {ThemeEditingContext} from '@/constants/Contexts'

function ThemeEntry(props:{text: string, theme:EventColorsType}){
    const {entry, setEntry} = useContext(ThemeEditingContext)

    return (
    <>    
    <Pressable onPress={()=>{setEntry([props.text, props.theme])}}>
        <View style={styles.themeEntryContainer}>
            <Text style={styles.themeEntryText}>{props.text}</Text>
            
            <View style={[styles.themePreviewMain, {backgroundColor: props.theme.background}]}>
                <View style={[styles.themePreviewSecondary, {backgroundColor: props.theme.text}]} />
            </View>
        </View>
    </Pressable>
        
    </>
    )
}

export default function themeEditor() {
    const [themeMap, setThemeMap] = useState<Map<string, EventColorsType> | null>(null)
    const [editing, setEditing] = useState<[string, EventColorsType] | null>(null)

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

    // Remove the unused Mappings
    async function smartCleanup() {
        if(themeMap == null)
            return

        loadData('eventData')
        .then((raw) => {
            const tmp = new Map<string, EventColorsType>()
            if(!raw || raw.length == 0){
                setThemeMap(tmp)
                return;
            }

            const lessons:EventData[] = JSON.parse(raw)

            lessons.forEach((el) => {
                if(!tmp.has(el.location)){
                    tmp.set(el.location, themeMap.get(el.location) || DefaultEventColor)
                }
            })

            setThemeMap(tmp)

        })
    }

    // Save editing changes to current state
    function saveEdits(val: [string, EventColorsType]) {
        const tmp = new Map(themeMap)
        tmp.set(val[0], val[1])
        setThemeMap(tmp)
    }

    if (themeMap == null) {
        return(
            <Text>Loading...</Text>
        )
    }

    return (
        <>
        <ThemeEditingContext.Provider value={{entry: editing, setEntry: setEditing, saveChanges: saveEdits}}>
        <View style={styles.container}>
            <FlatList style={styles.scrollContainer} contentContainerStyle={styles.elementsContainer}
            data={[...themeMap]}
            initialNumToRender={9}
            renderItem={ ({item, index}) => 
                <ThemeEntry key={index} text={item[0]} theme={item[1]} />
            } 
            />

            <View style={styles.navBar}>
                <Button onPress={() => {}} buttonSyle={{backgroundColor: '#27b452', color: 'white'}} pressStyle={{backgroundColor: '#51da7a', color: '#EEE'}}>Save</Button>
                <Button onPress={smartCleanup} buttonSyle={{backgroundColor: '#205de2', color: 'white'}} pressStyle={{backgroundColor: '#2a8fe2ff', color: '#EEE'}}>Clean</Button>
            </View>
        </View>

            <ThemeEntryModal></ThemeEntryModal>
        </ThemeEditingContext.Provider>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: 'column',
    },

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
    },

    navBar: {
        height: '15%',
        minHeight: 90,
        // backgroundColor: '#F3F3F3',
        elevation: 2,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    }
})