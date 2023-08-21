import React, { createContext, useContext, useState } from 'react'

interface ModalContextType {
    isModalOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>{children}</ModalContext.Provider>
}
