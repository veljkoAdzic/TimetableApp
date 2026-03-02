import { EventColorsType } from "@/constants/EventColors"
import { useState } from "react"
import { View, TextInput, type TextInputProps, FlatList, Pressable, Text, StyleSheet } from "react-native"


type DropdownTextProps = TextInputProps & {
    locations: string[],
    theme: EventColorsType,
    onLocationSave: () => void
}

export default function DropdownTextInput(props:DropdownTextProps){
    const [inputText, setInputText] = useState(props.value || "")
    const [filtered, setFiltered] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleChange = (text: string) => {
        setInputText(text);

        if (text.length === 0) {
            setFiltered([]);
            setShowDropdown(false);
            return;
        }

        const results = props.locations.filter((loc) =>
        loc.toLowerCase().includes(text.toLowerCase())
        );

        setFiltered(results);
        setShowDropdown(true);

        if(props.onChangeText)
            props.onChangeText(text)
    };

    const handleSelect = (location: string) => {
        setInputText(location);
        setShowDropdown(false);
        if(props.onChangeText){
            props.onChangeText(location)
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={inputText}
                onChangeText={handleChange}
                placeholder="Enter location"
                style={[props.style]}
                onFocus={() => inputText && setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
                onEndEditing={props.onLocationSave}
            />

            {showDropdown && filtered.length > 0 && (
                <View style={[styles.dropdown, {backgroundColor: props.theme.background}]}>
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    style={{backgroundColor: '#FFF3'}}
                    data={filtered}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                    <Pressable
                        style={styles.item}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={{color: props.theme.text}}>{item}</Text>
                    </Pressable>
                    )}
                />
                </View>
            )}
        </View>
    )

}


const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#000",
    // borderTopWidth: 0,
    marginHorizontal: 12,
    maxHeight: 150,
    backgroundColor: "white",
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 4
  },
  item: {
    padding: 12,
  },
});