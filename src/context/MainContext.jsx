"use client"
import { createContext, useState } from "react"

export const MainContext = createContext();
export function MainProvider({ children }) {

    const [reload, setReload] = useState(false)

    return (
        <MainContext.Provider value={{reload, setReload}}>
            {children}
        </MainContext.Provider>
    )
}