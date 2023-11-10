import { toast } from 'react-hot-toast'

const ToastComponent = (txt: string) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <span>{txt}</span>
        </div>
    )
}

export const sendToast = (txt: string) => {
    const component = ToastComponent(txt)

    toast.custom(component, { position: 'top-center' })
}
