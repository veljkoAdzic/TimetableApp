import { useState } from "react";
import { EventData} from "@/constants/EventTypes";
import { EventColorsType, DefaultEventColor } from "@/constants/EventColors";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Time from "@/constants/TimeClass";


export default function Item(props: {data: EventData, theme: EventColorsType | undefined, openCallback: (id: EventData) => void}) {
    const [data, setData] = useState(props.data)
    const [theme, setTheme] = useState<EventColorsType>(props.theme || DefaultEventColor)
    const startTime = new Time(data.startTime)
    const endTime = new Time(data.endTime)
    return(
        <>
        <Pressable
        onPress={() => { props.openCallback(data) } }>
            <View style={[styles.item, {backgroundColor: theme.background, borderColor: theme.border}]}>
                <Text style={{color:theme.text}}>{data.shortTitle}</Text>
                <Text style={{color: theme.text, opacity: 0.6, fontSize: 10}}>{data.location}</Text>
                <Text style={{color: theme.text, opacity: 0.5, fontSize: 8}}>{data.group}</Text>
                <Text style={{color: theme.text, opacity: 0.5, fontSize: 9, flexGrow: 1, verticalAlign: 'bottom', paddingBottom: 1, paddingLeft: 2}}>{`${startTime.toString()} - ${endTime.toString()}`}</Text>
            </View>
        </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'orange',
        height: 110,
        aspectRatio: 6/8,
        borderRadius: 5,
        padding: 1,
    },
})