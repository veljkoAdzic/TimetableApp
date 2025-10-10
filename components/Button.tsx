import { Text, Pressable, StyleSheet, TextStyle } from "react-native";


export default function Button(props: {onPress: () => void, buttonSyle?: TextStyle, pressStyle?: TextStyle, children:string, disabled?:boolean }) {
    const btnStyle = StyleSheet.flatten([{backgroundColor: '#9fc8eeff', color: '#222'}, props.buttonSyle || {}])
    const pressedStyle = StyleSheet.flatten([{backgroundColor: '#bad3ebff'}, props.pressStyle || {}])

    return (
        <Pressable onPress={props.onPress}>
        { ({pressed}) =>
            <Text style={[
                {
                paddingHorizontal: 18, 
                paddingVertical: 6, 
                color: 'white', 
                fontSize: 24,
                borderRadius: 6,
                elevation: 3
                }, 
                StyleSheet.flatten([btnStyle, ((pressed || (props.disabled ?? false)) ? pressedStyle : {} )]) 
            ]}
            >
            {props.children}
            </Text>                
        }
        </Pressable>
    )
}