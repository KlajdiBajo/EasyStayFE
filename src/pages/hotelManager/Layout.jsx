import Navbar from '../../components/hotelManager/Navbar';
import Sidebar from '../../components/hotelManager/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex h-full'>
        <Sidebar />
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
