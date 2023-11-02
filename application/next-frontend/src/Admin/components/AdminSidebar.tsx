import Image from 'next/image'
import Mascot from 'Admin/assets/MascotChilling.svg'
import TextBackground from 'Admin/assets/AdminSidebarBackground.svg'

const AdminSidebar = () => {
    return (
        <div>
            <div className="font-workSans text-white">
                <div className="relative mx-auto mb-8 w-[22rem]">
                    <Image priority src={TextBackground} width={345} alt="background" />
                    <h1 className="absolute left-[57%] top-[54%] w-[22rem] -translate-x-1/2 -translate-y-1/2 font-queensMedium text-6xl text-green-primary">
                        Pizza control in progress..
                    </h1>
                </div>

                <div className="mx-auto w-[19rem]">
                    <p>Welcome to the Admin Page!</p>
                    <p>
                        As the administrator, you can edit who is invited, where you are going and when the events take
                        place.
                    </p>
                </div>
            </div>
            <Image priority src={Mascot} width={450} alt="mascot" className="mx-auto" />
        </div>
    )
}

export { AdminSidebar }
