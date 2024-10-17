import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className='bg-black    '>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3 bg-black'>
                <Link to='/'>
                    <h1 className='font-bold text-white'>Auth App</h1>
                </Link>
                <ul className='flex gap-4 text-white'>
                    <Link to='/'>
                        <li>Home</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img 
                                src={currentUser.profilePicture} 
                                className="h-7 w-7 rounded-full object-cover" 
                                alt="profile" 
                            />
                        ) : (
                            <li>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </div>
    );
}
