import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { DEVELOPER_MODE } from '@/constants/Settings'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer>
        <Drawer.Screen name="index" options={{drawerLabel: 'Timetable', title: 'Weekly Timetable'}}/>
        <Drawer.Screen name='about' options={{drawerLabel: 'About', title: 'About Page'}} />
        <Drawer.Screen name='editor' options={{drawerLabel: 'Edit Screen', title: 'Editor Screen (final)'}} />

        <Drawer.Screen name='devTools' options={{
          drawerLabel: 'Dev Tools', 
          title: 'Developer Page',
          drawerItemStyle: (DEVELOPER_MODE) ? {} : {display: 'none'}
          }} />

      </Drawer>
    </GestureHandlerRootView>
  )
}
