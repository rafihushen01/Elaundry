import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUsers, FaBoxOpen } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { FaShop } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/Userslice";
import { FaClipboardList } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import BrandIdentity from "../BrandIdentity";
const SuperAdminNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const {id}=useParams("")
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handlesignout = () => {
    dispatch(setUserData(null));
  };

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/90 shadow-lg backdrop-blur-xl"
          : "bg-gradient-to-r from-green-200 via-green-100 to-green-50"
      }`}
      style={{ height: "85px" }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* LOGO */}
      <BrandIdentity
        title="E-Laundry SuperAdmin"
        subtitle="Operations Command"
        onClick={() => navigate("/Superadmin")}
        className="max-w-[200px] sm:max-w-none"
        titleClassName="text-base sm:text-xl md:text-2xl"
        subtitleClassName="hidden sm:block text-[11px] md:text-xs"
        logoClassName="h-9 w-9 md:h-10 md:w-10"
      />

      {/* DESKTOP SEARCH */}
      <motion.div
        className="hidden md:flex items-center bg-white rounded-full shadow-md px-5 py-3 w-1/2 lg:w-1/3 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.03 }}
      >
        <FaSearch size={20} className="text-green-700" />
        <input
          type="text"
          placeholder="Search users, orders, items..."
          className="w-full ml-2 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
        />
      </motion.div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* DASHBOARD */}
        <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/superadmin-dashboard")}
        >
          <MdDashboardCustomize size={22} />
        </motion.button>
                 <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/order")}
        >
          <FaClipboardList size={22} />
        </motion.button>
            

        {/* ACTIVE USERS */}
        <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/active-users")}
        >
          <FaUsers size={20} />
        </motion.button>

        {/* ORDERS */}
    
               <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/addshop")}
        >
          <FaShop size={22} />
        </motion.button>
        {/* ADD ITEMS */}
        <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/additem")}
        >
          <FaBoxOpen size={20} />
        </motion.button>

        {/* CREATE ACCOUNT */}
        <motion.button
          className="p-3 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.12 }}
          onClick={() => navigate("/accreator")}
        >
          <IoMdPersonAdd size={22} />
        </motion.button>

        {/* MOBILE SEARCH */}
        <FaSearch
          className="md:hidden text-green-700 cursor-pointer"
          size={23}
          onClick={() => setShowSearch(!showSearch)}
        />

        {/* PROFILE ICON */}
        <motion.div
          onClick={() => setShowProfile(!showProfile)}
          className="bg-green-600 text-white font-bold text-xl rounded-full h-12 w-12 flex items-center justify-center cursor-pointer shadow-lg"
          whileHover={{ scale: 1.12 }}
        >
          {userData?.username?.slice(0, 1).toUpperCase()}
        </motion.div>
      </div>

      {/* MOBILE SEARCH DROPDOWN */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg py-3 px-5 flex items-center gap-3 md:hidden"
          >
            <FaSearch size={20} className="text-green-700" />
            <input
              type="text"
              placeholder="Search everything..."
              className="w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFILE DROPDOWN */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-[95px] right-4 w-[230px] bg-white shadow-xl rounded-2xl p-5 flex flex-col gap-4 border"
          >
            <div className="font-bold text-gray-800 text-lg">
              {userData?.username?.toUpperCase()}
            </div>

            <button
              className="px-3 py-2 bg-green-600/10 text-green-700 font-semibold rounded-lg hover:bg-green-600/20"
              onClick={() => navigate("/superadmin-dashboard")}
            >
              Dashboard
            </button>

            <button
              className="px-3 py-2 bg-green-600/10 text-green-700 font-semibold rounded-lg hover:bg-green-600/20"
              onClick={() => navigate("/all-orders")}
            >
              View Orders
            </button>

            <button
              className="text-green-600 font-bold hover:text-gray-800"
              onClick={handlesignout}
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default SuperAdminNav;
