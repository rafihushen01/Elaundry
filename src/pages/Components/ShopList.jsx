import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa"
import { IoCall } from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import { serverurl } from "../../App.jsx"

const ShopList = () => {
  const { currentcity } = useSelector((state) => state.user) || {}
  const [shops, setshops] = useState([])
  const [branches, setbranches] = useState([])
  const [loading, setloading] = useState(false)

  const sliderref = useRef(null)

  // fetch all shops
  useEffect(() => {
    const fetch = async () => {
      setloading(true)
      try {
        const res = await axios.get(`${serverurl}/shop/all`)
        setshops(res.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setloading(false)
      }
    }
    fetch()
  }, [])

  // fetch branches by city
  useEffect(() => {
    if (!currentcity) return
    const fetchBranches = async () => {
      try {
        const res = await axios.get(
          `${serverurl}/shop/branches/${encodeURIComponent(currentcity)}`
        )
        setbranches(res.data.branches || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchBranches()
  }, [currentcity])

  // Framer Motion Variants for Container Staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  // Super Premium Animated Blue-Themed Shop Card
  const shopcard = (s) => (
    <motion.div
      variants={cardVariants}
      key={s._id}
      whileHover={{
        scale: 1.03,
        y: -10,
        boxShadow: "0px 30px 60px rgba(14, 165, 233, 0.4)" // Cool blue shadow
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="
        relative 
        min-w-[340px] sm:min-w-[390px] md:min-w-[420px] 
        h-[320px] 
        rounded-[2rem] 
        bg-[#0f172a] 
        border border-blue-500/20 
        overflow-hidden 
        cursor-pointer 
        group
      "
    >
      {/* BACKGROUND IMAGE WITH ZOOM EFFECT */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={s.image || '/placeholder.png'}
          alt={s.name}
          className="
            w-full h-full 
            object-cover 
            transition-transform duration-1000 
            group-hover:scale-110 
          "
        />
        {/* Deep Blue Holographic Overlay */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-t 
            from-[#020617] via-[#0f172a]/80 to-transparent
            group-hover:from-blue-950/90 group-hover:via-[#0f172a]/60
            transition-colors duration-500
          "
        ></div>
      </div>

      {/* SHOP INFO - GLASSMORPHISM PANEL */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative z-10"
        >
          {/* Shop Name */}
          <h2
            className="
              text-white 
              font-black 
              text-3xl 
              tracking-wide 
              drop-shadow-lg 
              mb-2
              group-hover:text-blue-400
              transition-colors duration-300
            "
          >
            {s.name}
          </h2>

          {/* Address Line */}
          <div className="flex items-start gap-2 text-blue-100/80 text-sm mb-4">
            <FaLocationArrow className="text-blue-500 mt-1 flex-shrink-0" />
            <span className="leading-snug">
              {s.address}, {s.city}, {s.state}
            </span>
          </div>

          {/* Contact Details Grid - Super Clean Layout */}
          <div className="grid grid-cols-1 gap-2 border-t border-blue-500/20 pt-3">
            <div className="flex items-center gap-3 text-sm text-gray-200 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/5 group-hover:border-blue-500/30 transition-all">
              <div className="bg-blue-600/20 p-1.5 rounded-lg text-blue-400">
                <MdEmail className="text-lg" />
              </div>
              <span className="truncate font-medium">{s.email}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-200 bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/5 group-hover:border-blue-500/30 transition-all">
              <div className="bg-blue-600/20 p-1.5 rounded-lg text-blue-400">
                <IoCall className="text-lg" />
              </div>
              <span className="font-medium tracking-wider">{s.mobile}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* TOP RIGHT BADGE */}
      <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-400/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
        <span className="text-xs font-bold text-white uppercase tracking-widest">e-Laundry</span>
      </div>
    </motion.div>
  )

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen">
      
      {/* Branches Section */}
      {currentcity && (
        <div className="mb-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">
              Branches in <span className="text-blue-600">{currentcity}</span>
            </h3>
          </div>

          <div className="flex gap-3 mt-3 flex-wrap">
            {branches.length ? (
              branches.map((b) => (
                <motion.div
                  key={b}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    px-6 py-2.5 
                    bg-white 
                    border border-blue-200 
                    rounded-2xl 
                    shadow-sm shadow-blue-500/5
                    text-slate-700 
                    font-bold
                    text-sm
                    cursor-pointer
                    hover:bg-blue-50
                    hover:border-blue-500
                    hover:shadow-md hover:shadow-blue-500/20
                    hover:text-blue-700
                    transition-all
                  "
                >
                  {b}
                </motion.div>
              ))
            ) : (
              <span className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
                No branches found in this city.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Shop Slider Section */}
      <div className="relative mt-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Shops</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : shops.length ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            ref={sliderref}
            className="
              flex gap-6 sm:gap-8 
              overflow-x-auto 
              scrollbar-hide 
              py-8 px-2 sm:px-4 
              scroll-smooth 
              snap-x snap-mandatory
              pb-12
            "
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide native scrollbars
          >
            {shops.map((s) => (
              <div key={s._id} className="snap-center">
                {shopcard(s)}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4 text-slate-200">🏪</div>
            <div className="text-slate-500 font-semibold text-lg">No shops available at the moment.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopList