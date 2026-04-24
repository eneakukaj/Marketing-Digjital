import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoIcon from '../utils/logo-advantage.png';

const Navbar= () => {
    const { user, logout } = useContext(AuthContext);
    const navigate= useNavigate();

    const handleLogout=() => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#06103b] text-white px-8 py-4 flex justify-between items-center border-b border-gray-800 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 p-2 rounded-xl border border-indigo-500/40 
                    shadow-[0_0_15px_2px_rgba(99,102,241,0.3)] 
                    hover:shadow-[0_0_20px_4px_rgba(99,102,241,0.5)] 
                    hover:border-indigo-400 
                    transition-all duration-300">
                <img src={logoIcon} alt="AdVantage Logo" className="w-6 h-6 object-contain"/>
            </div>
          <div>
          <h1 className="text-xl font-bold tracking-tight text-white">AdVantage</h1>
        </div>
        </div>
          <div className="flex items-center space-x-6">
                <Link 
                    to="/register" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-500/10 border border-indigo-500/20"
                >
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;