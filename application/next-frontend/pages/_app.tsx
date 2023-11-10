import '@/styles/globals.css'
import '@/styles/reset.css'
import '@/styles/fonts.css'
import '@/styles/tailwindComposables.css'
import type { AppProps } from 'next/app'
import { ModalProvider } from 'Shared/context/ModalContext'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ModalProvider>
            <Toaster />
            <Component {...pageProps} />
        </ModalProvider>
    )
}
