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

export const HoverProvider = ({
    children,
    isInsideModal = false,
}: {
    children: React.ReactNode
    isInsideModal?: boolean
}) => {
    const [isHovered, setLocalHovered] = useState(false)

    const setHovered = (hover: boolean) => {
        if (isInsideModal) {
            setLocalHovered(false)
        } else {
            setLocalHovered(hover)
        }
    }

    return <HoverContext.Provider value={{ isHovered, setHovered }}>{children}</HoverContext.Provider>
}
