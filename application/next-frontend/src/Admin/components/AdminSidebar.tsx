import Mascot from 'Admin/assets/mascot.svg'

const AdminSidebar = () => {
    return (
        <div className="bg-[#05793C]">
            <div className="mx-auto w-[19rem] font-workSans text-white">
                <h1 className="mb-10 text-5xl">Pizza control in progress..</h1>
                <p>Welcome to the Admin Page!</p>
                <p>
                    As the administrator, you can edit who is invited, where you are going and when the events take
                    place.
                </p>
            </div>
            <div className="mx-auto" style={{ border: '2px solid yellow' }}>
                <Mascot />
            </div>
        </div>
    )
}

export default AdminSidebar
