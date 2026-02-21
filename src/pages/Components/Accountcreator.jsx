// Accountcreator.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App";
import { IoPersonAdd, IoMail, IoLockClosed, IoPhonePortrait, IoImage } from "react-icons/io5";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
const roles = [
 
  "Admin",
  "Manager",
  "FieldDirector",
  "Customer",
  "DeliveryBoy"
];

export default function Accountcreator() {
  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    mobile: "",
 
  });

  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [success, setsuccess] = useState(null);
  const [showpassword, setshowpassword] = useState(false);
  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setmessage("");
    setsuccess(null);

    try {
      const res = await axios.post(`${serverurl}/sup/accreatror`, form, {
        withCredentials: true
      });

      setsuccess(true);
      setmessage(res.data.message);

      setform({
        username: "",
        email: "",
        password: "",
        role: "",
        gender: "",
        mobile: "",
    
      });
    } catch (err) {
      setsuccess(false);
      setmessage(err.response?.data?.message || "Request failed");
    }

    setloading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-500 p-5">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <IoPersonAdd size={40} className="text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">
            Create New User Account
          </h1>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-center mb-4 ${
              success ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handlesubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="font-semibold text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handlechange}
              className="w-full mt-1 p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <div className="flex items-center gap-2">
              <IoMail className="text-green-600 text-xl" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handlechange}
                className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold text-gray-700">Password</label>
            <div className="flex items-center gap-2">
              <IoLockClosed className="text-green-600 text-xl" />
              <input
                type={ showpassword?"text" :"password"}
                name="password"
                value={form.password}
                onChange={handlechange}
                className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                required
              />
            </div>
           <button
  type="button"
  className="absolute bottom-72 right-28 text-green-700 text-xl cursor-pointer"
  onClick={() => setshowpassword((p) => !p)}
>
  {!showpassword ? <IoMdEyeOff /> : <IoMdEye />}
</button>

          </div>

          {/* Mobile */}
          <div>
            <label className="font-semibold text-gray-700">Mobile Number</label>
            <div className="flex items-center gap-2">
              <IoPhonePortrait className="text-green-600 text-xl" />
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handlechange}
                className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          {/* <div>
            <label className="font-semibold text-gray-700">Photo URL</label>
            <div className="flex items-center gap-2">
              <IoImage className="text-green-600 text-xl" />
              <input
                type="text"
                name="photourl"
                value={form.photourl}
                onChange={handlechange}
                className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
                placeholder="Enter photo url"
                required
              />
            </div>
          </div> */}

          {/* Gender */}
          <div>
            <label className="font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handlechange}
              className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="font-semibold text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handlechange}
              className="w-full p-3 border rounded-lg bg-green-50 focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select role</option>
              {roles.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-xl"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
