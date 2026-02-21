// UltimateDeliveryNav.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdPerson, IoMdNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/Userslice";
import BrandIdentity from "../BrandIdentity";

const DeliveryBoyNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, currentcity } = useSelector((state) => state.user);

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [online, setOnline] = useState(true);
  const [pendingOrders, setPendingOrders] = useState(0);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate fetching pending delivery orders
  useEffect(() => {
    const fetchOrders = () => {
      // Replace with real API call
      setPendingOrders(Math.floor(Math.random() * 10));
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    dispatch(setUserData(null));
    navigate("/login");
  };

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/90 shadow-2xl backdrop-blur-xl border-b border-green-300"
          : "bg-gradient-to-r from-green-200 via-green-100 to-green-200"
      }`}
      style={{ height: "85px" }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* LOGO + GREETING */}
      <motion.div
        className="flex items-center gap-2 md:gap-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <BrandIdentity
          title="E-Laundry Delivery"
          subtitle="Rider Console"
          onClick={() => navigate("/")}
          className="max-w-[190px] sm:max-w-none"
          titleClassName="text-base sm:text-xl md:text-2xl"
          subtitleClassName="hidden sm:block text-[11px] md:text-xs"
          logoClassName="h-9 w-9 md:h-10 md:w-10"
        />
        <span className="hidden lg:inline text-sm text-gray-600">
          {getGreeting()}, {userData?.username || "Rider"}!
        </span>
      </motion.div>

      {/* DESKTOP SEARCH */}
      <motion.div
        className="hidden md:flex items-center bg-white rounded-full shadow-md px-5 py-2 w-1/3 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <FaLocationDot size={20} className="text-green-600" />
          <span className="text-sm md:text-base font-semibold text-gray-700 cursor-pointer hover:text-green-600">
            {currentcity || "Unknown"}
          </span>
        </div>

        <div className="flex items-center flex-grow pl-3 gap-2">
          <FaSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-sm md:text-base"
          />
        </div>
      </motion.div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Online Toggle */}
        <motion.div
          className={`px-3 py-1 rounded-full font-semibold cursor-pointer shadow-md text-white ${
            online ? "bg-green-600" : "bg-red-500"
          }`}
          whileHover={{ scale: 1.05 }}
          onClick={() => setOnline(!online)}
          title={online ? "You are Online" : "You are Offline"}
        >
          {online ? "Online" : "Offline"}
        </motion.div>

        {/* Notifications */}
        <motion.button
          className="relative p-2.5 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-all"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/delivery/notifications")}
          title="Pending Orders"
        >
          <IoMdNotifications size={22} />
          {/* {pendingOrders > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold px-1.5 rounded-full shadow-md animate-pulse">
              {pendingOrders}
            </span>
          )} */}
        </motion.button>

        {/* Mobile Search Toggle */}
        <FaSearch
          className="md:hidden text-green-700 cursor-pointer"
          size={22}
          onClick={() => setShowSearch(!showSearch)}
        />

        {/* Profile */}
        <motion.div
          onClick={() => setShowProfile(!showProfile)}
          className="bg-green-600 text-white font-semibold text-xl rounded-full h-12 w-12 flex items-center justify-center cursor-pointer shadow-lg"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          title="Profile"
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
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white shadow-md py-3 px-5 flex items-center gap-3 md:hidden z-[9999]"
          >
            <FaSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
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
            transition={{ duration: 0.25 }}
            className="fixed top-[95px] right-4 md:right-10 w-[220px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-5 flex flex-col gap-4 border border-green-300"
          >
            <div className="font-bold text-gray-800">
              {userData?.username?.toUpperCase()}
            </div>

            <button
              className="px-3 py-2 bg-green-600/10 text-green-700 font-semibold rounded-lg hover:bg-green-600/20 transition-all"
              onClick={() => navigate("/delivery/orders")}
            >
              My Deliveries
            </button>

            <button
              className="text-green-600 font-bold hover:text-gray-800 transition-colors cursor-pointer"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default DeliveryBoyNav;
