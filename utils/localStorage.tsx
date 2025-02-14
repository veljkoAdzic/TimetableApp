import { DEVELOPER_MODE } from "@/constants/Settings"
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

export const clearStorage = async () => {
    if(!DEVELOPER_MODE)
        return;

    await AsyncStorage.clear()
}

export const listStoredData = async () => {
    if(!DEVELOPER_MODE) return null;
    const res = new Map<string, string>();
    const keys = await AsyncStorage.getAllKeys()
    for(let k of keys){
        let v = await loadData(k);
        res.set(k, v!);
    }
    return res;
}