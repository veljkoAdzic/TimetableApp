import { View, FlatList, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DAYS, EventData } from '@/constants/EventTypes'
import { loadData } from '@/utils/localStorage'
import { formatEventTitle, loadThemeMap } from '@/utils/eventTools'
import { EventColorsType } from '@/constants/EventColors'
import EditorButtons from '@/components/EditorButtons'
import { DEVELOPER_MODE } from '@/constants/Settings'
import DropDownPicker from 'react-native-dropdown-picker'

interface EditorProps {
    data?: EventData[]
}

function Title(props: {text: string}) {
    return (
        <View style={styles.title}>
            <Text style={styles.titleText}>{props.text}</Text>
            <View style={styles.titleLine} />
        </View>
    )
}

function Form(props: {data: EventData, editCallback: (edit: EventData) => void}){
    const [formData, setFormData] = useState(props.data)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ddItems, setDdItems] = useState([
        {label: 'Monday', value: 'MON'},
        {label: 'Tuesday', value: 'TUE'},
        {label: 'Wednesday', value: 'WED'},
        {label: 'Thursday', value: 'THU'},
        {label: 'Friday', value: 'FRI'},
        {label: 'Other', value: '-'}
    ])

    const [day, setDay] = useState(formData.day);

    useEffect(() => {
        console.log("Change day " + formData.day + " to " + day)
        let tmp = {...formData, day};
        setFormData(tmp);
        //props.editCallback(tmp);
    },[day])


    return (
        <View>
            <TextInput
            style={styles.input}
            onChangeText={(title) => { 
                let tmp = {...formData, title};
                setFormData(tmp)
            }
            }
            onEndEditing={ ()=>{
                let tmp = {...formData}
                tmp.title = tmp.title.trim()
                setFormData(tmp)
                //props.editCallback(tmp)
            } }
            value={formData.title}
            placeholder='Class name'
            />

            <TextInput
            style={styles.input}
            onChangeText={(text) => { 
                let tmp = {...formData}
                tmp.location = text
                setFormData(tmp)
            }
            }
            onEndEditing={ ()=>{
                let tmp = {...formData}
                tmp.location = tmp.location.trim()
                setFormData(tmp)
                //props.editCallback(tmp) 
            } }
            value={formData.location}
            placeholder='Location'
            />

            <DropDownPicker 
            open={dropdownOpen} 
            value={formData.day}
            items={ddItems}
            setOpen={setDropdownOpen}
            setValue={setDay}
            // onChangeValue={() => props.editCallback(formData)}
            setItems={setDdItems}
            />
            
        </View>
    )
}


function Item(props: {data: EventData, index: number, editCallback: (data: EventData, index: number) => void}) {
    const [data, setData] = useState(props.data)
    const [modalVisible, setModalVisible] = useState(false);
    const theme = {...ThemeMap.get(data.location)}

    function setEdits(edited: EventData){ // callback for form editing
        setData(edited)
        //props.editCallback(data, props.index);
    }

    return(
        <>
        <Pressable
        // style={{backgroundColor: '#FFE9E9', padding: 15, borderRadius: 10, marginRight: 20}}
        onPress={() => setModalVisible(true)}>
            <View style={[styles.item, {backgroundColor: theme.background, borderColor: theme.border}]}>
                <Text style={{color:theme.text}}>{formatEventTitle(data.title)}</Text>
                <Text style={{color: theme.text, opacity: 0.6, fontSize: 10}}>{data.location}</Text>
            </View>
        </Pressable>
        

        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
        }}
        >
        <View style={styles.centeredView}>
            <Pressable
            style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
            onPress={() => {
                setModalVisible(false)
                props.editCallback(data,props.index)
            }}
            />

            <View style={[styles.modalView, {backgroundColor: theme.background, borderColor: theme.border}]}>

            <Form data={data} editCallback={setEdits} />

            
            {/* <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 22}}>
                Delete Async Storage?
                </Text>
            <View style={{flexDirection: 'row'}}>
                <Pressable
                    style={{backgroundColor: '#FFE9E9', padding: 15, borderRadius: 10, marginRight: 20}}
                    onPress={() => setModalVisible(false)}>
                    <Text style={{color: 'red', fontSize: 20}}>Cancel</Text>
                </Pressable>

                <Pressable
                    style={{backgroundColor: 'red', padding: 15, borderRadius: 10}}
                    onPress={() => {
                        console.log("MODAL " + props.data.title)
                        setModalVisible(false)
                    }
                }>
                    <Text style={{color: '#FFF', fontSize: 20}}>Delete</Text>
                </Pressable>
            </View> */}
            </View>
        </View>
        </Modal>
        </>
    )
}

const SECTIONS_END = ".IGNORE"
const sections = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Others', SECTIONS_END]

const ThemeMap = new Map<string, EventColorsType>()

export default function Editor(props: EditorProps) {
    const [data, setData] = useState<EventData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        setLoading(true)
        
        loadThemeMap(ThemeMap)
        .then(() =>{
            if(DEVELOPER_MODE)
                console.log("[editor2>useEffect([])]: ThemeMap loaded!")
        })
        .catch(() =>{
            if(DEVELOPER_MODE)
                console.error("[editor2>useEffect([])]: failed to load ThemeMap!")
        })

        if(props.data != undefined)
            setData(props.data)
        else{
            loadData('eventData')
            .then(res =>{
                let tmp = (res)? JSON.parse(res) : []
                setData(tmp)
            })
        }
        setLoading(false);
    }, [])

    if(loading){
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    function editData(changes: EventData, i: number){
        let tmp = [...data]
        tmp = tmp.map((item, ind) => ind == i ? changes : item)
        tmp.push(changes)
        setData(tmp);
    }

    const renderSections = ({item, index}: {item:string, index: number}) => {
        if(item == SECTIONS_END){
            return(
                <View style={styles.section}>
                    
                <View style={[styles.title, {opacity: 1, justifyContent: 'space-evenly', gap: 10, marginTop: 50 , width: '80%'}]}>
                
                    
                    <Pressable
                    onPress={ () => {console.log("Save")} }
                    >
                        <Text style={[styles.button, {backgroundColor: 'lime'}]}>Save</Text>
                    </Pressable>

                    <Pressable
                    onPress={ () => {console.log("Discard")} }
                    >
                        <Text style={[styles.button, {backgroundColor: 'red'}]}>Discard</Text>
                    </Pressable>


                </View> 
                </View>
            )
        }

        return (
            <View style={styles.section}>
                <Title text ={item} />
                <View style={styles.itemContainer}>
                    {
                        data.filter((event) => (index != sections.length-1 && event.day == DAYS[index]) || 
                                                (index == sections.length-1 && !DAYS.includes(event.day))
                                    )
                        .map((tile, j) => {
                            return <Item key={j} data={tile} index={j} editCallback={editData}/>
                        })
                    }
                </View>
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
            <FlatList style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 100}}
            data={sections}
            initialNumToRender={4}
            renderItem={ renderSections } />

            <EditorButtons />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: "1%",
    },
    section: {
        width: '100%',
    },
    title: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingHorizontal: 10,
        opacity: 0.25
    },
    titleText: {
        color: 'black',
        paddingHorizontal: 5
    },
    titleLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    },
    itemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '3%',
        padding: '1%',
        minHeight: 50,
        
        paddingHorizontal: 15
    },
    item: {
        backgroundColor: 'orange',
        height: 110,
        aspectRatio: 6/8,
        borderRadius: 5
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0008'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        width: "80%"
    },

    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    button: { 
        paddingHorizontal: 18, 
        paddingVertical: 6, 
        color: 'white', 
        fontSize: 24,
        borderRadius: 6,
    }
})