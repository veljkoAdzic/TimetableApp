import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { DEVELOPER_MODE } from '@/constants/Settings'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer>
        <Drawer.Screen name="index" options={{drawerLabel: 'Timetable', title: 'Weekly Timetable'}}/>
        <Drawer.Screen name='themeEditor' options={{drawerLabel: 'Edit Colours', title: 'Editor for lesson colours'}} />
        <Drawer.Screen name='editor' options={{drawerLabel: 'Edit Lessons', title: 'Editor for lessons'}} />

        <Drawer.Screen name='devTools' options={{
          drawerLabel: 'Dev Tools', 
          title: 'Developer Page',
          drawerItemStyle: (DEVELOPER_MODE) ? {} : {display: 'none'}
          }} />

      </Drawer>
    </GestureHandlerRootView>
  )
}
