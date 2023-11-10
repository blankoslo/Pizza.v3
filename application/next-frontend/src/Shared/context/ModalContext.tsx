import React, { createContext, useContext, useState } from 'react'
import { ModalWrapper } from 'Shared/modal/ModalWrapper'

interface ModalContextType {
    modalStack: React.ReactElement[]
    openModal: (modalContent: React.ReactElement) => void
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
    const [modalStack, setModalStack] = useState<React.ReactElement[]>([])

    const openModal = (modalContent: React.ReactElement) => {
        setModalStack((prevStack) => [...prevStack, modalContent])
    }

    const closeModal = () => {
        setModalStack((prevStack) => prevStack.slice(0, -1))
    }

    return (
        <ModalContext.Provider value={{ modalStack, openModal, closeModal }}>
            {children}
            {modalStack.map((modal, index) => (
                <ModalWrapper key={index}>{modal}</ModalWrapper>
            ))}
        </ModalContext.Provider>
    )
}
