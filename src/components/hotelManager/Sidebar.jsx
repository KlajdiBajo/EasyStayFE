import { MdDashboard, MdFormatListBulleted } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const Sidebar = () => {
  const { auth } = useContext(AuthContext);

  // Hide sidebar if not a hotel manager
  if (auth?.role !== "MANAGER") return null;

  const sidebarLinks = [
    { name: "Dashboard", path: "/hotelManager", icon: MdDashboard },
    { name: "Add Room", path: "/hotelManager/add-room", icon: AiOutlinePlus },
    {
      name: "List Rooms",
      path: "/hotelManager/list-rooms",
      icon: MdFormatListBulleted,
    },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 
            ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`
          }
        >
          <item.icon className="h-6 w-6" />
          <span className="md:block hidden">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
