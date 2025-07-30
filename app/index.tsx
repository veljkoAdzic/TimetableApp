import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import TimetableScreen from '@/screens/TimetableScreen'
import { useEffect, useRef, useState } from 'react'
import { DEVELOPER_MODE } from '@/constants/Settings'

export default function Index() {
    const {refresh} = useLocalSearchParams()
    const [reload, setReload] = useState(false)
    
    const handleRefresh = useRef<string | string[] | null>(null);

    useEffect(()=>{
        if(refresh && handleRefresh.current !== refresh){
            if(DEVELOPER_MODE)
                console.log("[Index>UseEffect<refresh>]: Rerender triggered")
            setReload(true)
            handleRefresh.current = refresh
        }
    },[refresh])

    useEffect(()=>{
        if(reload)
            setReload(false)
    }, [reload])

    return (
    <View style={styles.container} >
        <TimetableScreen />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '100%',
        backgroundColor: '#F0F0F0'
    }
})