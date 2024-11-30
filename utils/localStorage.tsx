import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key: string, data: string) => {
    try{
        await AsyncStorage.setItem(key, data)
    } catch(err) {
        console.error(`[storeData]: ${err}`)
    }
}
export const loadData = async (key: string) => {
    try{
        let result = await AsyncStorage.getItem(key)
        return result;
    } catch(err) {
        console.error(`[loadData]: ${err}`)
    }
}