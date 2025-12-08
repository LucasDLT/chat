'use client'
import { useState, createContext, ReactNode, useEffect } from "react"

interface IcontextProps{
    //interface para las variables, setters o handlers que pase por contexto a la app 
}


interface ContextProviderProps{
    //interface para saber que va a ser el children del contexto
    children:ReactNode
}

export const ContextApp = createContext<IcontextProps>({
    //este seria el contexto propiamente dicho, y aca van enlistadas las props que tipemos en la interface
})

export const ContextWebSocket = ({children}:ContextProviderProps)=>{
    const value ={}
    //value son los valores que vamos a pasar desde aca a la app, todas las props

    return <ContextApp.Provider value={value}>{children}</ContextApp.Provider>
}
