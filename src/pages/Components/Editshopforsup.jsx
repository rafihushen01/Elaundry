import React, { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { serverurl } from "../../App.jsx"

const Editshop = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setform] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    address: "",
    branch: ""
  })

  const [image, setimage] = useState(null)
  const [preview, setpreview] = useState(null)
  const [loading, setloading] = useState(false)

  // 🔥 Load existing shop data
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${serverurl}/shop/single/${id}`)
        const d = res.data.data

        setform({
          name: d.name || "",
          mobile: d.mobile || "",
          email: d.email || "",
          city: d.city || "",
          state: d.state || "",
          address: d.address || "",
          branch: d.branch || ""
        })

        if (d.image) setpreview(d.image)
      } catch (err) {
        console.log(err)
      }
    }
    fetchdata()
  }, [id])

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const handleimage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setimage(file)
      setpreview(URL.createObjectURL(file))
    }
  }

  const handlesubmit = async () => {
    setloading(true)

    const fd = new FormData()
    Object.keys(form).forEach((key) => fd.append(key, form[key]))
    if (image) fd.append("image", image)

    try {
      await axios.put(`${serverurl}/shop/edit/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      alert("Shop Updated Successfully")
      // redirect if needed

    } catch (err) {
      console.log(err?.response?.data || err?.message)
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="w-full flex justify-center py-10 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[42rem] bg-white shadow-2xl rounded-3xl p-10 border border-green-300"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-green-600 mb-8 text-center"
        >
          Edit Shop
        </motion.h1>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-5">
          <FloatingInput label="Shop Name" name="name" value={form.name} onChange={handlechange} />
          <FloatingInput label="Mobile Number" name="mobile" value={form.mobile} onChange={handlechange} />
          <FloatingInput label="Email" name="email" value={form.email} onChange={handlechange} />
          <FloatingInput label="Branch" name="branch" value={form.branch} onChange={handlechange} />
          <FloatingInput label="City" name="city" value={form.city} onChange={handlechange} />
          <FloatingInput label="State" name="state" value={form.state} onChange={handlechange} />

          <div className="col-span-2 relative">
            <textarea
              name="address"
              value={form.address}
              onChange={handlechange}
              className="w-full p-3 h-28 border rounded-xl outline-none focus:border-green-500"
            />
            <span className="absolute top-[-10px] left-3 bg-white px-1 text-green-600 text-sm">
              Full Address
            </span>
          </div>

          <div className="col-span-2">
            <label className="text-green-600 font-semibold">Upload Shop Image</label>
            <input
              type="file"
              name="image"
              onChange={handleimage}
              className="w-full p-3 border rounded-xl mt-2"
            />

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-52 object-cover rounded-2xl shadow-lg border border-green-200"
                />
              </motion.div>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlesubmit}
          className="w-full mt-7 bg-green-600 text-white py-3 rounded-2xl shadow-xl text-lg font-semibold"
        >
          
          {loading ? "Updating..." : "Save Shop"}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Editshop


/* Floating Input Component */
const FloatingInput = ({ label, name, value, onChange }) => {
  return (
    <div className="relative">
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded-xl outline-none focus:border-green-500"
      />
      <span className="absolute top-[-10px] left-3 bg-white px-2 text-green-600 text-sm">
        {label}
      </span>
    </div>
  )
}
