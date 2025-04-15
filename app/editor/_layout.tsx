import { Link, Stack } from "expo-router";

export default function EditScreen(){
    return (
        <Stack
            initialRouteName="editScreen"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="downloader" />
            <Stack.Screen name="editScreen" />
        </Stack>
    )
}