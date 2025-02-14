import { clearStorage, listStoredData } from "@/utils/localStorage"
import { useState } from "react"
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView, Modal } from "react-native" 
import { ColorProperties } from "react-native-reanimated/lib/typescript/Colors"

function Table(props:{header: string[], data: Map<string, string>}){
    const tableStyle = StyleSheet.create({
        table: {
            flex: 1,
            flexDirection: 'column',
            alignSelf: 'center',
            width: '90%',
            elevation: 5,
        },
        row: {
            flexDirection: 'row',
            borderColor: 'darkgray',
            borderBottomWidth: 1,
        },
        cell: {
            flex: 1,
            padding: 9,
            fontSize: 18,
            justifyContent: 'center'
        },
        th: {
            backgroundColor: '#CCC',
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: "center",
        },
        td: {
        },
        text: {
            fontSize: 14,
        },
    })

    if(props.header.length < 2){
        console.error("[Table]: 'header' prop must be array of length >= 2")
        return null;
    }

    if(props.data.size == 0){
        return(
            <Text style={{fontSize: 18, paddingLeft: 10}}>The Async Storage is Empty</Text>
        )
    }

    return (
        <View style={tableStyle.table}>
            <View style={tableStyle.row}>
                <View style={[tableStyle.th, tableStyle.cell]}>
                    <Text style={[tableStyle.text, tableStyle.th]}>{props.header[0]}</Text>
                </View>
                <View style={[tableStyle.th, tableStyle.cell]}>
                    <Text style={[tableStyle.text, tableStyle.th]}>{props.header[1]}</Text>
                </View>
            </View>

            {
            [...props.data].map((row, i) => {
                return (
                <View key={i} style={tableStyle.row}>
                    <View style={[tableStyle.td, tableStyle.cell]}>
                        <Text style={tableStyle.text}>{row[0]}</Text>
                    </View>
                    <View style={[tableStyle.td, tableStyle.cell]}>
                        <Text style={tableStyle.text}>{JSON.stringify(JSON.parse(row[1]), null, 4)}</Text>
                    </View>
                </View>
                )
            })
            }
        </View>
    )
}

export default function DevScreen(){
    const [asData, setasData] = useState<Map<string, string> | null>(null)
    const [asModalVisible, setAsModalVisible] = useState(false);
    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}> 
            <View >
                <Pressable 
                onPress={ () =>{
                    listStoredData()
                    .then((table) =>{
                        //console.log(table)
                        setasData(table)
                    })
                } }
                >
                    { ({pressed}) =>
                    <Text style={[styles.button, (pressed) ? styles.buttonActive : styles.buttonPassive]}>Check Async Storage</Text>
                    }
                </Pressable>

                {(asData != null) ? <Table header={["Keys", "Values"]} data={asData} /> : null}
            </View>

            <View>
            <Pressable 
                onPress={ () =>{
                    setAsModalVisible(true)
                    // clearStorage().then(() => {
                    //     console.log("Async Storage cleared!")
                    // })
                } }
                >
                    { ({pressed}) =>
                    <Text style={[styles.button, (pressed) ? styles.buttonActive : styles.buttonPassive]}>Delete Async Storage</Text>
                    }
                </Pressable>


                <Modal
                animationType="slide"
                transparent={true}  
                visible={asModalVisible}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setAsModalVisible(!asModalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 22}}>
                        Delete Async Storage?
                        </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable
                            style={{backgroundColor: '#FFE9E9', padding: 15, borderRadius: 10, marginRight: 20}}
                            onPress={() => setAsModalVisible(false)}>
                            <Text style={{color: 'red', fontSize: 20}}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={{backgroundColor: 'red', padding: 15, borderRadius: 10}}
                            onPress={() => {
                                clearStorage().then(() => {
                                    console.log("Async Storage cleared!")
                                })
                                setAsModalVisible(false)
                            }
                        }>
                            <Text style={{color: '#FFF', fontSize: 20}}>Delete</Text>
                        </Pressable>
                    </View>

                    </View>
                </View>
                </Modal>

            </View>
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'flex-start',
        paddingTop: 12,
        // paddingHorizontal: 30,
        
        // justifyContent: 'flex-start'
    },

    scrollContainer: {
        width: '100%',
        //  alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'green',
        gap: 30,
        paddingBottom: 60,
        // paddingLeft: 10,
    },

    button: {
        // paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 24,
        // width: 'auto',
        marginBottom: 20,
        textDecorationLine: 'underline',
        // backgroundColor: '#91d7ff',
    },
    buttonPassive: { color: "#1d2366" },
    buttonActive: {  color: "#80B1FF" },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        elevation: 5,
        width: "80%"
    },
})