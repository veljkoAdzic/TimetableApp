import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { DEVELOPER_MODE } from "@/constants/Settings"
import { clearStorage, listStoredData, storeData } from "@/utils/localStorage"
import { useState } from "react"
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView, Modal } from "react-native" 

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

function generateDummyData(){
    if (!DEVELOPER_MODE) return;

    const data = [
    {
        id: 1,
        title: "Matematika 3",
        day: 'MON',
        startTime: [8, 0],
        endTime: [10, 45],
        location: "AMF PED",
        teacher: 'Prof a',
        extra_descriptions: ["Prof a"]
    },

    {
        id: 2,
        title: "Kompjuterski Mrezi i Bezbednost",
        day: 'MON',
        startTime: [11, 0],
        endTime: [12, 45],
        location: "AMF PED",
        teacher: 'Prof b',
        extra_descriptions: ["Prof b"]
    },
    {
        id: 3,
        title: "Digitizacija A",
        day: 'MON',
        startTime: [14, 0],
        endTime: [15, 30],
        location: "2",
        teacher: 'Prof c',
        extra_descriptions: ["labs"]
    },

    {
        id: 4,
        title: "Algoritmi i Podatocni Strukturi",
        day: 'MON',
        startTime: [15, 30],
        endTime: [17, 0],
        location: "215",
        teacher: 'Prof d',
        extra_descriptions: ["labs"]
    },

    {
        id: 5,
        title: "Matematika 3 A",
        day: 'MON',
        startTime: [18, 30],
        endTime: [20, 0],
        location: "2",
        teacher: 'Prof a / Prof e',
        extra_descriptions: ["labs"]
    },

    {
        id: 6,
        title: "Kompjuterski Mrezi i Bezbednost",
        day: 'TUE',
        startTime: [15, 30],
        endTime: [17, 0],
        location: "215",
        teacher: 'Prof e / Prof h / Prof a',
        extra_descriptions: ["labs"]
    },

    {
        id: 7,
        title: "Matematika 3",
        day: 'TUE',
        startTime: [17, 0],
        endTime: [19, 45],
        location: "AMF PED",
        teacher: 'Prof a',
        extra_descriptions: ["Asis a"]
    },

    {
        id: 8,
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [10, 0],
        endTime: [11, 45],
        location: "223",
        teacher: 'Prof a',
        extra_descriptions: ["Prof c"]
    },

    {
        id: 9,
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [12, 0],
        endTime: [12, 45],
        location: "223",
        teacher: 'Prof a',
        extra_descriptions: ["Asis b"]
    },

    {
        id: 10,
        title: "Digitizacija",
        day: 'FRI',
        startTime: [12, 0],
        endTime: [13, 45],
        location: "FINKI AMF G",
        teacher: 'Prof a',
        extra_descriptions: ["Asis b"]
    },
    {
        id: 11,
        title: "Digitizacija",
        day: 'FRI',
        startTime: [14, 0],
        endTime: [15, 45],
        location: "FINKI AMF G",
        teacher: 'Prof a',
        extra_descriptions: ["Prof c"]
    },
    {
        id: 12,
        title: "Internet Programiranje na Klientska Strana",
        day: 'THU',
        startTime: [12, 30],
        endTime: [14, 0],
        location: "138",
        teacher: 'Prof a',
        extra_descriptions: ["labs"]
    },
    {
        id: 13,
        title: "Kompjuterski Mrezi i Bezbednost",
        day: 'THU',
        startTime: [14, 0],
        endTime: [15, 45],
        location: "AMF PED",
        teacher: 'Prof a',
        extra_descriptions: ["asis d"]
    },
    {
        id: 14,
        title: "Algoritmi i Podatocni Strukturi",
        day: 'THU',
        startTime: [16, 0],
        endTime: [17, 45],
        location: "AMF PED",
        teacher: 'Prof a',
        extra_descriptions: ["prof d"]
    },
    {
        id: 15,
        title: "Algoritmi i Podatocni Strukturi",
        day: 'THU',
        startTime: [18, 0],
        endTime: [19, 45],
        location: "AMF PED",
        teacher: 'Prof a',
        extra_descriptions: ["asis d"]
    },
    ]

    storeData('eventData', JSON.stringify(data))
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
                } }
                >
                    { ({pressed}) =>
                    <Text style={[styles.button, (pressed) ? styles.buttonActive : styles.buttonPassive]}>Delete Async Storage</Text>
                    }
                </Pressable>


                {
                    asModalVisible ?
                    <ConfirmationDialog
                    OK={() =>{
                        clearStorage().then(() => {
                            console.log("Async Storage cleared!")
                        })
                        setAsModalVisible(false)
                    }}
                    OKtext="Delete"
                    OKstyle={{backgroundColor: 'red', padding: 15, borderRadius: 10,color: '#FFF', fontSize: 20}}
                    Cancel={() =>{ setAsModalVisible(false) }}
                    CancelStyle={{backgroundColor: '#fbdedeff', color: 'red', fontSize: 20, padding: 15, borderRadius: 10, marginRight: 20}}
                    >
                        Delete Async Storage?
                    </ConfirmationDialog>
                    :
                    <></>
                }
            </View>

            <View>
            <Pressable 
                onPress={ () =>{
                    generateDummyData()
                } }
                >
                    { ({pressed}) =>
                    <Text style={[styles.button, (pressed) ? styles.buttonActive : styles.buttonPassive]}>Generate Dummy Data</Text>
                    }
                </Pressable>
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