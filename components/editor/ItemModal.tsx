import {View, Pressable, Modal, StyleSheet } from 'react-native'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Form from './Form'
import { useState, useEffect, useContext } from 'react'
import { EventData, DefaultEventData } from '@/constants/EventTypes'
import { EventColorsType, DefaultEventColor, EventColors } from '@/constants/EventColors'
import { LessonEditingContext, ThemeEditingContext } from '@/constants/Contexts'
import ThemeEntryModal from '../ThemeEntryModal'


export default function ItemEditModal(props: {data: EventData | null, ThemeMap: Map<string, EventColorsType>}) {
    const [cdVisible, setCDvisible] = useState(false);  // Confirmation Dialog visibility
    const [theme, setTheme] = useState<EventColorsType>(DefaultEventColor) // the theme of the modal that is currently in use
    const {openItem, setOpenItem, editData, deleteElemenet, handleClose} = useContext(LessonEditingContext) // Data and methods for the current editing lesson

    // state and method for editing theme with in ThemeEntryModal component
    const [editingTheme, setEditingTheme] = useState<[string, EventColorsType] | null>(null)
    function saveTheme(val: [string, EventColorsType]) {
        if( val[0] == null || val[0].length == 0) return

        setTheme(val[1])
        props.ThemeMap.set(val[0], val[1])
        
    }
    // ~

    // refreshing of theme
    useEffect(() =>{
        if(openItem == null || openItem.location.length == 0) return

        if (!props.ThemeMap.has(openItem.location)){
            const index = props.ThemeMap.size % EventColors.length
            props.ThemeMap.set(openItem.location, EventColors[index])
        }
        setTheme({...props.ThemeMap.get(openItem.location)!})
    }, [openItem?.location, props.ThemeMap])
    // ~

    // callback for form editing
    function setEdits(edited: EventData){
        if(edited.location.length != 0) {
            if (!props.ThemeMap.has(edited.location)){
                const index = props.ThemeMap.size % EventColors.length
                props.ThemeMap.set(edited.location, EventColors[index])        
            }
            setTheme({...props.ThemeMap.get(edited.location)!})
            
            setOpenItem(edited);
            editData(edited, edited.id)
        }
    }
    // ~

    return (
        <>
        <ThemeEditingContext.Provider value={{entry: editingTheme, setEntry: setEditingTheme, saveChanges: saveTheme}}>       
            <ThemeEntryModal /> 
        </ThemeEditingContext.Provider>        

        

        { cdVisible ?
            <ConfirmationDialog
            OK={()=>{
                setCDvisible(false)
                deleteElemenet(openItem!.id)
                handleClose(null)
            }}
            OKtext="Delete"
            Cancel={()=>{ setCDvisible(false) }}>
                Are you sure you want to delete this lesson?
            </ConfirmationDialog>
            : <></>
        }

        <Modal
        animationType="fade"
        transparent={true}
        visible={!!openItem}
        style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0 }}
        statusBarTranslucent={true}
        onRequestClose={() => {
            if(openItem) {
                editData(openItem, openItem.id)
                handleClose(openItem)
            } else {
                handleClose(null)
            }
        }}
        >
        <View style={[styles.centeredView, {position: 'absolute', top: 0, left: 0, right:0, bottom: 0 }]}>
            <Pressable
            style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
            onPress={() => {
                handleClose(openItem)
            }}
            />

            <View style={[styles.modalView, {backgroundColor: theme.background, borderColor: theme.border}]}>

            <Form 
            data={openItem ?? DefaultEventData } 
            theme={theme} 
            editCallback={setEdits} 
            openThemeEditor={(loc: string) => {setEditingTheme([loc, theme])}} 
            autofillLocations={[...props.ThemeMap.keys()]}
            />

            <View style={styles.editBar}>
                <Pressable
                onPress={() =>{ setEdits(openItem!); handleClose(openItem) }}
                style={styles.editBarButton}
                >
                    <MaterialCommunityIcons name="content-save" size={28} color={theme.text} />
                </Pressable>
                
                <Pressable
                onPress={() =>{ setCDvisible(true) }}
                style={styles.editBarButton}
                >
                    <MaterialCommunityIcons name="delete" size={28} color={theme.text} />
                </Pressable>
            </View>

            </View>
        </View>
        </Modal>

        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0008',
        paddingBottom: "10%",
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 0,
        paddingBottom: 0,
        alignItems: 'center',
        elevation: 5,
        width: "80%",
    },
    editBar: {
        paddingVertical: 5,
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-around',
        backgroundColor: '#FFF3',
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopWidth: 1,
    },
    editBarButton: {
        padding: 10,
    }
})