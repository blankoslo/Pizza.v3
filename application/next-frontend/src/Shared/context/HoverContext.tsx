import { createContext, useContext, useState } from 'react'

interface HoverContextType {
    isHovered: boolean
    setHovered: (hovered: boolean) => void
}

const HoverContext = createContext<HoverContextType | undefined>(undefined)

export const useHover = () => {
    const context = useContext(HoverContext)
    if (!context) {
        throw new Error('useHover must be used within a HoverProvider')
    }
    return context
}

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHovered, setHovered] = useState(false)

    return <HoverContext.Provider value={{ isHovered, setHovered }}>{children}</HoverContext.Provider>
}
