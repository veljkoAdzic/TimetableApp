import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

// import Grid from '@/components/Grid'
import TimetableDisplay from '@/components/TimetableDisplay'

export default function Index() {
    return (
        <View style={styles.container} >
            <TimetableDisplay />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '100%'
    }
})