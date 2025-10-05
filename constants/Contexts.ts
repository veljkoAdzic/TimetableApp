import { createContext } from "react"
import { EventColorsType } from "./EventColors"

export const ThemeEditingContext = createContext<{entry:[string, EventColorsType] | null, setEntry:(val:[string, EventColorsType] | null) => void, saveChanges:(val:[string, EventColorsType]) => void}>(
    {
        entry: null, 
        setEntry: (val) => {},
        saveChanges: (val) => {}
    }
)