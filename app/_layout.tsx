// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import  { Stack, useNavigation } from 'expo-router';
// import Index from './index';

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: 'Home' }} />
    // </Stack>

    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer>
        <Drawer.Screen name="index" options={{drawerLabel: 'Timetable', title: 'Weekly Timetable'}}/>
        <Drawer.Screen name="editor" options={{drawerLabel: 'Edit', title: 'Edit Timetable'}}/>
        <Drawer.Screen name="editor2" options={{drawerLabel: 'Edit2', title: 'Edit Timetable (fr)'}}/>
        <Drawer.Screen name='about' options={{drawerLabel: 'About', title: 'About Page'}} />
      </Drawer>
    </GestureHandlerRootView>

    // <Index />
  )
}
  // const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  // return (
  //   <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  //     <Stack>
  //       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  //       <Stack.Screen name="+not-found" />
  //     </Stack>
  //     <StatusBar style="auto" />
  //   </ThemeProvider>
  // );
  // }
