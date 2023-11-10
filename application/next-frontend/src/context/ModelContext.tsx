import React, { createContext, useContext, useState } from 'react'
import { ModalWrapper } from '@/Shared/modal/ModalWrapper'

interface ModalContextType {
    isModalOpen: boolean
    modalContent: null | React.ReactElement
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState<React.ReactElement | null>(null)

    const openModal = (modalContent: React.ReactElement) => {
        setIsModalOpen(true)
        setModalContent(modalContent)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalContent(null)
    }

    return (
        <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
            {children}
            {isModalOpen && <ModalWrapper>{modalContent}</ModalWrapper>}
        </ModalContext.Provider>
    )
}
