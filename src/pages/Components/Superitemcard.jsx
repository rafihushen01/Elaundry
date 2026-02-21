import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { serverurl } from "../../App.jsx"
import { FaArrowLeft, FaArrowRight, FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { MdRateReview } from "react-icons/md";
const SUPERADMINITEMCARD = () => {
  const navigate = useNavigate()
  const sliderRef = useRef(null)
 const{id}=useParams()
  const [items, setitems] = useState([])
  const [loading, setloading] = useState(true)

  // fetch all items
  useEffect(() => {
    const fetchitems = async () => {
      try {
        const res = await axios.get(`${serverurl}/item/all`, {
          withCredentials: true,
        })
        setitems(res.data.data)
      } catch (err) {
        console.log(err?.response?.data || err?.response?.message)
      } finally {
        setloading(false)
      }
    }

    fetchitems()
  }, [])

  // delete item (dynamic per item)
  const deleteitem = async (itemid) => {
    try {
      const res = await axios.delete(`${serverurl}/item/delete/${itemid}`, {
        withCredentials: true,
      })

      alert(res.data.message)

      // refresh items instantly
      setitems((prev) => prev.filter((x) => x._id !== itemid))
    } catch (err) {
      console.log(err?.response?.data || err?.response?.message)
    }
  }

  // slider controls
  const slideleft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }
  const slideright = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 md:px-12 relative">

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-green-700 mb-10"
      >
        SuperAdmin — All Items
      </motion.h1>

      {/* Left Arrow */}
      <button
        onClick={slideleft}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-10 hover:bg-green-100"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={slideright}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-10 hover:bg-green-100"
      >
        <FaArrowRight size={20} />
      </button>

      {/* Loader */}
      {loading && (
        <div className="flex gap-6 overflow-x-auto py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-64 h-56 bg-gray-200 animate-pulse rounded-3xl"
            ></div>
          ))}
        </div>
      )}

      {/* Items */}
      {!loading && (
        <motion.div
          ref={sliderRef}
          className="flex gap-6 overflow-x-scroll scrollbar-none py-4"
        >
          {items.map((it) => (
            <motion.div
              key={it._id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="w-64 min-w-[16rem] bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200 cursor-pointer"
            >
              <div className="w-full h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={it.image}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {it.name}
                </h2>

                <p className="text-lg font-bold text-green-600 mt-1">
                  Iron Price: ৳ {it.price}
                </p>

                <p className="text-lg font-bold text-green-600 mt-1">
                  Washing Price: ৳ {it.washingprice}
                </p>

                <div className="flex justify-between gap-4 mt-4">

                  {/* Edit */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate(`/edititem/${it._id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </motion.button>

                  {/* Delete */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => deleteitem(it._id)}
                    className="w-full text-red-600 hover:text-red-800 py-2 rounded-xl font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <MdDelete /> Delete
                  </motion.button>
                       <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate(`/ownerreview/${it._id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <MdRateReview /> Reviews
                  </motion.button>

                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default SUPERADMINITEMCARD
