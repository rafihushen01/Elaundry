import React, { useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setUserData } from "../redux/Userslice";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useTranslation } from "react-i18next";
import BrandIdentity from "../BrandIdentity";

import axios from "axios";
import { serverurl } from "../../App";

const Nav = () => {
    const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };
    useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
  }, []);
  const navigate = useNavigate();
   const { userData, currentcity ,currentcartiems} = useSelector((state) => state.user);
     const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolling, setScrolling] = useState(false);
const{currentcartitems}=useSelector((state)=>state.user||{})

  const handlesignout = async () => {
    try {

      dispatch(setUserData(null));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };


  // scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[9999] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolling
          ? "bg-white/80 shadow-xl backdrop-blur-xl"
          : "bg-gradient-to-r from-green-100 via-green-50 to-green-100"
      }`}
      style={{ height: "85px" }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* LOGO */}
      <BrandIdentity
        title={userData?.role == "SuperAdmin" ? "E-Laundry SuperAdmin" : "E-Laundry"}
        subtitle={userData?.role == "SuperAdmin" ? "Operations Command" : "Pickup, Clean, Delivery"}
        onClick={() => navigate("/")}
        className="max-w-[190px] sm:max-w-none"
        titleClassName="text-base sm:text-xl md:text-2xl"
        subtitleClassName="hidden sm:block text-[11px] md:text-xs"
        logoClassName="h-9 w-9 md:h-10 md:w-10"
      />
      

      {/* DESKTOP SEARCH */}
      <motion.div
        className="hidden md:flex items-center bg-white rounded-full shadow-md px-5 py-3 w-1/2 lg:w-1/3 hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
      >
        {/* Location */}
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <FaLocationDot size={20} className="text-green-600" />
          <span className="text-sm md:text-base font-semibold text-gray-700 cursor-pointer hover:text-green-600">
            {currentcity}
          </span>
        </div>


        {/* Search input */}
        <div className="flex items-center flex-grow pl-3 gap-2">
          <FaSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search laundry services..."
            className="w-full text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-sm md:text-base"
          />
        </div>
      </motion.div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 md:gap-6">

        {/* Cart */}
        <motion.button
          className="relative p-2.5 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-all"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/cart`)}

        >
     <IoMdCart size={22} />
          <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold px-1.5 rounded-full shadow-md">
          {currentcartiems?.length||0}
          </span>
       </motion.button>
        { userData?.role=="SuperAdmin" && <motion.button
          className="relative p-2.5 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-all"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/accreator")}
        >
     <IoMdPersonAdd size={22} />
          <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold px-1.5 rounded-full shadow-md">
          
          </span>
       </motion.button>}
            <div className="lang-switch  ">
              <div className="flex gap-2">



        <button className="font-bold cursor-pointer" onClick={() => changeLanguage("en")}>EN</button>
        <button className="font-bold cursor-pointer" onClick={() => changeLanguage("bn")}>BN</button>
        <button className="font-bold cursor-pointer" onClick={() => changeLanguage("fr")}>FR</button>
              </div>
      </div>

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
       placeholder="Search services..."
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
            className="fixed top-[95px] right-4 md:right-10 w-[220px] bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl p-5 flex flex-col gap-4 border"
          >
            <div className="font-bold text-gray-800">    {userData?.username.toUpperCase()} </div>

            <button className="px-3 py-2 bg-green-600/10 text-green-700 font-semibold rounded-lg hover:bg-green-600/20 transition-all"
              onClick={() => navigate("/myorders")}
            >
              My Orders
            </button>

            <button className="text-green-600 font-bold hover:text-gray-800 transition-colors cursor-pointer"   onClick={handlesignout}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
