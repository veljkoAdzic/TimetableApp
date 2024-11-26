import { View, Text, StyleSheet } from 'react-native'
import { Link, Stack } from 'expo-router'

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{ title: 'Page Not Found'}} />
    <View>
      <Link href='/'>Go to Home</Link>
    </View>
    </>
  )
}