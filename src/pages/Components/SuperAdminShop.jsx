import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { FaMapMarkerAlt } from "react-icons/fa"
import { serverurl } from "../../App.jsx"
import { IoCall } from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"

const ShopListforsuperadmin = () => {
  const { currentcity } = useSelector((state) => state.user) || {}
  const { shopId } = useParams("")
  const [shops, setshops] = useState([])
  const [branches, setbranches] = useState([])
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
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


  // DELETE SHOP + AUTO REFRESH
  const deleteshop = async (shopid) => {
    try {
      const res = await axios.post(`${serverurl}/shop/delete/${shopid}`, {
        withCredentials: true,
      })

      alert(res.data.message)

      // refresh instantly
      setshops((prev) => prev.filter((s) => s._id !== shopid))
    } catch (err) {
      console.log(err?.response?.data || err?.response?.message)
    }
  }


  // super premium animated shop card
  const shopcard = (s) => (
    <motion.div
      key={s._id}
      whileHover={{
        scale: 1.08,
        rotate: 0.5,
        y: -8,
        boxShadow: "0px 25px 60px rgba(0,255,120,0.45)",
      }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="
        relative 
        w-[330px] sm:w-[390px] md:w-[460px] 
        h-[260px] 
        rounded-3xl 
        bg-gradient-to-br 
        from-gray-100 via-white to-gray-50 
        border border-green-500/30 
        shadow-2xl 
        overflow-hidden 
        cursor-pointer 
        group
        hover:shadow-green-500/40
      "
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src={s.image || '/placeholder.png'}
          alt={s.name}
          className="
            w-full h-full 
            object-cover 
            rounded-3xl 
            transition-all duration-700 
            group-hover:scale-110 
            group-hover:rotate-[1deg]
            group-hover:brightness-[1.15]
          "
        />

        {/* holographic overlay */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-t 
            from-black/80 via-black/40 to-transparent 
            group-hover:from-green-700/40 
            transition-all duration-700
          "
        ></div>
      </div>

      {/* SHOP INFO */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-14 left-6 right-6"
      >
        <h2
          className="
            text-white 
            font-extrabold 
            text-3xl 
            tracking-wide 
            drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]
          "
        >
          {s.name}
        </h2>

        <div className="flex items-center gap-2 text-gray-200 text-sm drop-shadow-md mt-2 flex-wrap">
          <FaMapMarkerAlt className="text-green-400 text-lg" />
          <span className="opacity-90">{s.address}, {s.city}, {s.state}</span>

          <div className="flex justify-between gap-5 mt-2">
            <MdEmail className="text-orange-500 text-xl" />
            <span>{s.email}</span>

            <IoCall className="text-green-600 text-xl" />
            <span>{s.mobile}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex flex-col gap-2">
          <motion.button
            onClick={() => navigate(`/editshop/${s._id}`)}
            whileTap={{ scale: 0.92 }}
            className="
              w-full bg-green-600 hover:bg-green-700 
              text-white py-2 rounded-xl 
              font-medium shadow-md 
              flex items-center justify-center gap-2
            "
          >
            <FaEdit /> Edit Shop
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => deleteshop(s._id)}
            className="
              w-full text-red-600 hover:text-red-800 
              py-2 rounded-xl 
              font-medium shadow-md 
              flex items-center justify-center gap-2
            "
          >
            <MdDelete /> Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )


  return (
    <div className="w-full min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
        SuperAdmin – All Shops
      </h1>

      {loading ? (
        <p className="text-center text-lg font-semibold">Loading shops...</p>
      ) : (
        <div className="
          w-full 
          flex flex-wrap 
          justify-center gap-8
        ">
          {shops.map((s) => shopcard(s))}
        </div>
      )}
    </div>
  )
}

export default ShopListforsuperadmin
