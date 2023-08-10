import Image from 'next/image';
import PizzaBotTitle from '@/Landing/assets/illustrations/PizzaBotTitle.svg';
import { AddToSlackButton } from './components/AddToSlackButton';

const Header = () => {
    return (
        <nav className="header flex flex-row items-center gap-8">
            <div className="flex-1">
                <Image src={PizzaBotTitle} width={300} alt="Pizza Bot" />
            </div>
            <div>
                <button className="hover:bg-gray-300 p-4 font-bold">About us</button>
            </div>
            <AddToSlackButton />
        </nav>
    );
};

export { Header };
