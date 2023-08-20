import Link from 'next/link'

const Navbar = () => {
    const navbar = [
        { name: 'Home', link: '/admin' },
        //{ name: 'Restaurants', link: '/admin/restaurants' }
        // { name: 'Events', link: '/admin/events' },
        // { name: 'People', link: '/admin/people' },
        // { name: 'Groups', link: '/admin/groups' },
        { name: 'About', link: '/admin/about' },
        { name: 'Pictures', link: '/admin/pictures' },
    ]

    return (
        <div className="overflow-hidden bg-teal-400 text-gray-700">
            <ul className="flex items-center space-x-6 p-4">
                {navbar.map((entry, index) => (
                    <li className="m-3 cursor-pointer" key={index}>
                        <Link
                            href={entry.link}
                            className="text-lg font-bold transition duration-300 hover:text-gray-500"
                        >
                            {entry.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Navbar
