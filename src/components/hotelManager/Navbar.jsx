import { Link } from "react-router-dom";
import { assets } from "../../assets/images/assets";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const Navbar = () => {
    // In your component
    const { auth } = useContext(AuthContext);

    if (auth?.role !== "HOTEL_MANAGER") return null; // don't render Sidebar/Navbar
    
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80"/>
      </Link>
    </div>
  )
}

export default Navbar
