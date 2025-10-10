import { createContext } from "react"
import { EventColorsType } from "./EventColors"
import { EventData } from "./EventTypes"

interface ThemeEditingContextType {
    entry:[string, EventColorsType] | null, 
    setEntry:(val:[string, EventColorsType] | null) => void, 
    saveChanges:(val:[string, EventColorsType]) => void
}
export const ThemeEditingContext = createContext<ThemeEditingContextType>(
    {
        entry: null, 
        setEntry: (val) => {},
        saveChanges: (val) => {}
    }
)


interface LessonEditingContextType {
    openItem:EventData | null, 
    setOpenItem:(val:EventData | null) => void,
    editData: (changes: EventData, id: number) => void,
    deleteElemenet: (id: number) => void,
    handleClose: (final: EventData | null) => void
}
export const LessonEditingContext = createContext<LessonEditingContextType>(
    {
        openItem: null, 
        setOpenItem: (val) => {},
        editData: (changes: EventData, id: number) => {},
        deleteElemenet: (id: number) => {},
        handleClose: (final: EventData | null) => {}
    }
)