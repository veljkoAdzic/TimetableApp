import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { DEVELOPER_MODE } from '@/constants/Settings'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer screenOptions={{drawerContentContainerStyle:{gap: 10}, drawerItemStyle:{borderRadius: 20}}}>
        <Drawer.Screen name="index" options={{
          drawerLabel: 'Timetable',
          title: 'Weekly Timetable', 
          drawerIcon: ({color, size}) => (<MaterialCommunityIcons name="table" size={size} color={color} />)
          }}/>
        <Drawer.Screen name='themeEditor' options={{
          drawerLabel: 'Edit Colours', 
          title: 'Editor for lesson colours', 
          drawerIcon: ({color, size}) => (<MaterialCommunityIcons name="palette" size={size} color={color} />)
          }} />
        <Drawer.Screen name='editor' options={{
          drawerLabel: 'Edit Lessons', 
          title: 'Editor for lessons',  /* pencil table-edit layers-edit playlist-edit square-edit-outline*/
          drawerIcon: ({color, size}) => (<MaterialCommunityIcons name="square-edit-outline" size={size} color={color} />)
          }} />

        <Drawer.Screen name='devTools' options={{
          drawerLabel: 'Dev Tools', 
          drawerIcon: ({color, size}) => (<MaterialCommunityIcons name="developer-board" size={size} color={color} />),
          title: 'Developer Page',
          drawerItemStyle: (DEVELOPER_MODE) ? {borderRadius: 20} : {display: 'none'}
          }} />

      </Drawer>
    </GestureHandlerRootView>
  )
}
