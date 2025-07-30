import {View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
export default function DownloaderPage1() {
    const router = useRouter()
    return ( 
        <View>
            <Text>Page 2</Text>
            
            <Pressable onPress={() => { router.back() }}>
                <Text>Go back</Text>
            </Pressable>
        </View>
     )
}