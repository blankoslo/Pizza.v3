import { toast } from 'react-hot-toast'

const ToastComponent = (text: string) => {
    return (
        <div className="flex w-auto min-w-[550px] flex-col items-center justify-center rounded-[8px] bg-green-light p-6">
            <span>{text}</span>
        </div>
    )
}

export const sendToast = (text: string) => {
    const component = ToastComponent(text)

    toast.custom(component, { position: 'top-center' })
}
