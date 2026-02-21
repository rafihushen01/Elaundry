import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { serverurl } from "../../App.jsx"

const EditItem = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [name, setname] = useState("")
  const [price, setprice] = useState("")
  const [image, setimage] = useState(null)
  const [preview, setpreview] = useState("")
  const [loading, setloading] = useState(false)
  const [isedit, setisedit] = useState(false)
const[washingprice,setwashingprice]=useState("")
  // ========== FETCH SINGLE ITEM ==========
  useEffect(() => {
    if (id) {
      setisedit(true)
      fetchsingle()
    }
  }, [id])

  const fetchsingle = async () => {
    try {
      const res = await axios.get(`${serverurl}/item/single/${id}`, {
        withCredentials: true,
      })
      const data = res.data.data
      setname(data.name)
      setprice(data.price)
      setpreview(data.image)
      setwashingprice(data.washingprice)
    } catch (err) {
      console.log(err)
    }
  }

  const handleimage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setimage(file)
    setpreview(URL.createObjectURL(file))
  }

 const handlesubmit = async (e) => {
  e.preventDefault();
  setloading(true);

  try {
    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
  form.append("washingprice", washingprice) 
    if (image) form.append("image", image);

    let res;

    if (isedit) {
      // ----------------- EDIT ITEM -----------------
      try {
        res = await axios.put(`${serverurl}/item/edit/${id}`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.log(err?.response?.data);
        console.log(err?.response?.message);
        setloading(false);
        return alert("Failed to update item!");
      }}
    //  else {
    //   // ----------------- ADD ITEM -----------------
    //   try {
    //     res = await axios.post(`${serverurl}/item/add`, form, {
    //       withCredentials: true,
    //       headers: { "Content-Type": "multipart/form-data" },
    //     });
    //   } catch (err) {
    //     console.log(err?.response?.data);
    //     console.log(err?.response?.message);
    //     setloading(false);
    //     return alert("Failed to add item!");
    //   }
    // }

    setloading(false);
    alert("Item saved successfully!");


  } catch (err) {
    console.log(err?.response?.data);
    console.log(err?.response?.message);
    setloading(false);
    alert("Unexpected error!");
  }
};


  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e7ffe7] py-10 px-4">

      {/* OUTER CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
      >

        {/* TOP GREEN GRADIENT STRIP */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-600 to-lime-400"></div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-green-600 mb-6 text-center"
        >
          {isedit ? " Edit Item" : " Add New Item"}
        </motion.h1>

        {/* FORM */}
        <form onSubmit={handlesubmit} className="space-y-6">

          {/* ITEM NAME */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
            <label className="text-gray-700 font-medium">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="Enter item name..."
              required
            />
          </motion.div>

          {/* PRICE */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <label className="text-gray-700 font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setprice(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="Enter price..."
              required
            />
          </motion.div>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <label className="text-gray-700 font-medium">WashingPrice</label>
            <input
              type="number"
              value={washingprice}
              onChange={(e) => setwashingprice(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 outline-none transition"
              placeholder="Enter washingprice..."
              required
            />
          </motion.div>

          
          {/* IMAGE UPLOAD */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
            <label className="text-gray-700 font-medium">Item Image</label>
            <input
              type="file"
              onChange={handleimage}
              className="w-full p-2 rounded-xl border border-gray-300 bg-gray-50 cursor-pointer"
              accept="image/*"
            />

            {/* PREVIEW */}
            {preview && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl shadow-lg mt-4 border border-gray-200"
              />
            )}
          </motion.div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-green-600 to-lime-500 shadow-lg hover:shadow-2xl transition-all"
          >
            {loading ? "Saving..." : isedit ? "Update Item" : "Add Item"}
          </motion.button>

        </form>

      </motion.div>
    </div>
  )
}

export default EditItem
