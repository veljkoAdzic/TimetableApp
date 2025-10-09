import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput } from 'react-native'
import {useCallback, useState, createContext, useContext} from 'react'
import { DefaultEventColor, EventColorsType } from '@/constants/EventColors'
import { loadThemeMap } from '@/utils/eventTools'
import { useFocusEffect, useRouter } from 'expo-router'
import { DEVELOPER_MODE } from '@/constants/Settings'
import Button from '@/components/Button'
import { loadData, storeData } from '@/utils/localStorage'
import { EventData } from '@/constants/EventTypes'
import ThemeEntryModal from '@/components/ThemeEntryModal'
import {ThemeEditingContext} from '@/constants/Contexts'

function ThemeEntry(props:{text: string, theme:EventColorsType, renameCallback:(old:string, newLesson:string) => void}){
    const {entry, setEntry} = useContext(ThemeEditingContext)
    const [inputValue, setInputValue] = useState(props.text)
    return (
    <>    
    <Pressable onPress={()=>{setEntry([props.text, props.theme])}}>
        <View style={styles.themeEntryContainer}>
            <TextInput 
                        placeholder='location' 
                        inputMode='text' 
                        style={[styles.themeEntryText, (inputValue.length == 0) ? {borderBottomColor: 'red', backgroundColor: 'rgba(255, 195, 195, 1)'} : {}]}
                        onChangeText={ (nextTxt) => setInputValue(nextTxt) }
                        onEndEditing={() => { props.renameCallback(props.text, inputValue.trim())}}
                        value={inputValue}
                         />
            
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
    const [lessons, setLessons] = useState<EventData[]>([])
    const [editing, setEditing] = useState<[string, EventColorsType] | null>(null)
    const router = useRouter()
    
    useFocusEffect(
        useCallback(()=>{ // Memoising the function
            
            // Load theme from async storage
            const tmp = new Map<string, EventColorsType>()
            loadThemeMap(tmp)
            .then(()=>{
                setThemeMap(tmp)
            })
            .then(() => {
                return loadData('eventData')
            })
            .then((raw)=>{
                    if(!raw)
                        return
                    else
                        setLessons(JSON.parse(raw!) || [])

                })
            .catch(() =>{
                if(DEVELOPER_MODE)
                    console.error("[themeEditor>useFocusEffect]: failed to load ThemeMap!")
            })

            return () =>{} // must return function
    
        }, [])
    );

    // Remove the unused Mappings
    function smartCleanup() {
        if(themeMap == null)
            return

        const tmp = new Map<string, EventColorsType>()
        lessons.forEach((el) => {
            if(!tmp.has(el.location)){
                tmp.set(el.location, themeMap.get(el.location) || DefaultEventColor)
            }
        })

        setThemeMap(tmp)
    }

    // Save changes to async storage and redirect
    async function saveToStorage() {
        if(themeMap == null) return

        storeData('ThemeMap', JSON.stringify([...themeMap]))
        .then(() => storeData('eventData', JSON.stringify(lessons)) )
        .then(() => router.push({pathname:'/', params: {refresh: Date.now().toString()}}) )
    }

    // Save editing changes to current state
    function saveEdits(val: [string, EventColorsType]) {
        const tmp = new Map(themeMap)
        tmp.set(val[0], val[1])
        setThemeMap(tmp)
    }

    function locationRename(old:string, newName: string) {
        old = old.trim()
        newName = newName.trim()
        
        if(old == newName) return

        if(!themeMap) return;
        if(newName.length == 0) return

        let less = lessons.map((val) => {
            if(val.location == old)
                return {...val, location: newName}
            else 
                return val
        })
        setLessons(less)

        let tmp = new Map(themeMap) || new Map();
        tmp.set(newName, tmp.get(old)!)
        tmp.delete(old)
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
                <ThemeEntry key={`${index}-${item[0]}`} text={item[0]} theme={item[1]} renameCallback={locationRename} />
            } 
            />

            <View style={styles.navBar}>
                <Button onPress={saveToStorage} buttonSyle={{backgroundColor: '#27b452', color: 'white'}} pressStyle={{backgroundColor: '#51da7a', color: '#EEE'}}>Save</Button>
                <Button onPress={smartCleanup} buttonSyle={{backgroundColor: '#205de2', color: 'white'}} pressStyle={{backgroundColor: '#2a8fe2ff', color: '#EEE'}}>Clean</Button>
            </View>
        </View>

            <ThemeEntryModal />
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
        verticalAlign: 'middle',
        zIndex: 5, 
        borderBottomWidth: 1, 
        borderBottomColor: '#1113', 
        width: '50%',
        paddingBottom: 1,
        paddingLeft: 6,
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
        elevation: 15,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,

        backgroundColor: '#f0f1f2',
        // minHeight: '15%',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        // paddingBottom: '5%',
    }
})