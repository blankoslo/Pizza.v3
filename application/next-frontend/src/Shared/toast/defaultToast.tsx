import { toast } from 'react-hot-toast'

const ToastComponent = (text: string) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-green-light rounded-[8px] w-auto min-w-[550px]">
            <span>{text}</span>
        </div>
    )
}

export const sendToast = (text: string) => {
    const component = ToastComponent(text)

    toast.custom(component, { position: 'top-center' })
}
