import {View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native'
import {ThemeEditingContext} from '@/constants/Contexts'
import { useContext, useState } from 'react'
import { EventColorsType, EventColors } from '@/constants/EventColors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ColorPicker, {Panel1, Swatches, Preview, OpacitySlider, HueSlider, InputWidget, SaturationSlider, LuminanceSlider, BrightnessSlider } from 'reanimated-color-picker'
function ColourButton(props:{theme: EventColorsType, onClick:() => void}){

    return (
        <Pressable onPress={() => {           
                props.onClick()
            } } 
            style={{padding: 4}}
            >
            <View style={{padding: 2, borderRadius: '50%', borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center', elevation: 2, backgroundColor: '#F5F5F5'}} >
                <View style={[styles.themeButtonMain, {backgroundColor: props.theme.background}]}>
                    <View style={[styles.themeButtonSecondary, {backgroundColor: props.theme.text}]} />
                </View>
            </View>
        </Pressable>
    )
}

export default function ThemeEntryModal(){
    const {entry, setEntry, saveChanges} = useContext(ThemeEditingContext)
    const [tabFocused, setTabFocused] = useState<'background' | 'text'>('background')

    if (entry == null){
        return <></>
    }

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={entry != null}
        onRequestClose={() => {}}>
            <View style={styles.centeredView}>
                <Pressable
                style={{position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}
                onPress={() =>{ saveChanges(entry); setEntry(null) } 
                }
                />

                <View style={styles.modalView}>

                

                    <View style={styles.tabBar}>
                        <Pressable style={[styles.tab, (tabFocused != 'background' ? {backgroundColor: '#DDD', borderBottomRightRadius: 5} : {})]}
                        onPress={() => {setTabFocused('background')}}>
                            <Text style={{}}>Background</Text>
                        </Pressable>

                        <Pressable style={[styles.tab, (tabFocused != 'text' ? {backgroundColor: '#DDD', borderBottomLeftRadius: 5} : {})]}
                        onPress={() => {setTabFocused('text')}}>
                            <Text>Text</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.title}>
                        {entry[0]}
                    </Text>

                    <View style={styles.previewPickerContainer}>

                        <View style={styles.colourPickerGroup}>
                            {/* <Text style={{fontSize: 15}}>Preview</Text> */}
                        <View style={[styles.previewBlock, {backgroundColor: entry[1].background, borderColor: entry[1].border}]}>
                            <Text style={{color: entry[1].text}}>Title</Text>
                            <Text style={{color: entry[1].text, fontSize:10, opacity: 0.5}}>Sub Text 1</Text>
                            <Text style={{color: entry[1].text, fontSize: 9, opacity: 0.5}}>Sub Text 2</Text>
                        </View>
                        </View>

                        <View style={[styles.colourPickerGroup]}>
                        <ColorPicker 
                        value={entry[1][tabFocused]} 
                        boundedThumb={true} 
                        onChangeJS={({hex}) => { 
                            let newColor = {...entry[1]}
                            newColor[tabFocused] = hex
                            setEntry([entry[0], newColor])
                        } } 
                        >
                            <View style={{display: 'flex', flexDirection: 'column', gap: 10, width: 170, backgroundColor: '#FAFAFA', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#DDD'}}>
                                <Panel1 style={{aspectRatio: 1/1, width: '100%', height: 'auto'}} />
                                
                                <HueSlider style={{}} />
                            </View>
                        </ColorPicker>
                        </View>
                    </View>

                    <FlatList fadingEdgeLength={15} style={styles.coloursContainer} contentContainerStyle={{gap: 15, padding: 10, paddingBottom: 20}}
                        data={Array(Math.ceil(EventColors.length/3)).map((_, ind) =>  {return [ind*3, ind*3+1, ind*3+2] })}
                        initialNumToRender={9}
                        renderItem={ ({item, index}) => 
                            <View key={index} style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <ColourButton theme={EventColors[index*3+0]} onClick={() => { setEntry([entry[0], EventColors[index*3+0]]) } } />
                            <ColourButton theme={EventColors[index*3+1]} onClick={() => { setEntry([entry[0], EventColors[index*3+1]]) } } />
                            <ColourButton theme={EventColors[index*3+2]} onClick={() => { setEntry([entry[0], EventColors[index*3+2]]) } } />
                            </View>
                        } 
                        />

                    <View style={styles.editBar}>
                        <Pressable
                        onPress={() =>{ saveChanges(entry); setEntry(null); }}
                        style={styles.editBarButton}
                        >
                            <MaterialCommunityIcons name="content-save" size={28} color={'#151515'} />
                        </Pressable>
                        
                        <Pressable
                        onPress={() =>{ setEntry(null); }}
                        style={styles.editBarButton}
                        >
                            <MaterialCommunityIcons name="delete" size={28} color={'#151515'} />
                        </Pressable>
                    </View>

                </View>

            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
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
        // padding: 35,
        // paddingVertical: 5,
        alignItems: 'center',
        elevation: 5,
        width: "80%",
        gap: 25,
        overflow: 'hidden',
    },

    tabBar: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        overflow: 'hidden', 
        height: 45,
        paddingBottom: 3,
        borderBlockColor: '#EEE',
        borderBottomWidth: 1,
    },

    tab: {
        width: '50%', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'white'
    },

    title: {
        width: '80%', 
        fontSize: 18, 
        borderBottomColor: '#1115', 
        borderBottomWidth: 1, 
        paddingLeft: 5,
    },

    previewPickerContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 15,  
        justifyContent: 'space-between',
        padding: 5,
        borderBottomWidth: 1,
        borderColor: "#11111155",
        width: '80%',
        minHeight: '30%',
    },

    previewBlock: {
        padding: 2,
        borderWidth: 1,
        borderRadius: 6,
        minWidth: 80,
        minHeight: 90,
        
    },

    colourPickerGroup: {
        display: 'flex', 
        gap: 15, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15,
        height: 'auto',
    },

    pickerContainer: {
        borderRadius: 10, 
        display: 'flex', 
        overflow: 'hidden', 
        gap: 2, 
        borderWidth: 2, 
        borderColor: '#CCC', 
        width: 50, 
        height: 100, 
        padding: 1,
        backgroundColor: '#EEE'
    },

    coloursContainer: {
        display: 'flex', 
        height: "12%",
        width: '80%',
    },

    themeButtonMain: {
        height: 40,
        aspectRatio: 1/1,
        borderRadius: '50%',
        overflow: 'hidden',
        // elevation: 3,
    },
    themeButtonSecondary: {
        width: '150%',
        aspectRatio: 1/1,
        margin: '35%',
        transform: [{rotateZ: '45deg'}],

        borderColor: '#F5F5F5',
        borderWidth: 2.5,
    },

    editBar: {
        paddingVertical: 5,
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'space-around',
        width: '80%',
        borderTopWidth: 1,
        borderColor: '#1115',
    },
    editBarButton: {
        padding: 10,
    }
})