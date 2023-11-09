import '@/styles/globals.css'
import '@/styles/reset.css'
import '@/styles/fonts.css'
import '@/styles/tailwindComposables.css'
import type { AppProps } from 'next/app'
import { ModalProvider } from '@/context/ModelContext'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ModalProvider>
            <Component {...pageProps} />
        </ModalProvider>
    )
}
