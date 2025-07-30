import { Link, Stack } from "expo-router";

export default function EditScreen(){
    return (
        <Stack
            initialRouteName="editScreen"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="editScreen" />
            <Stack.Screen name="endpointScreen" />
            <Stack.Screen name="downloader2" />
        </Stack>
    )
}