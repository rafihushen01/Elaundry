import react from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { serverurl } from '../App'
import { useNavigate } from 'react-router-dom'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {setUserData} from "./redux/Userslice.js"
import {useDispatch} from "react-redux"
import {Auth} from "./Firebase.jsx"
import { FcGoogle } from "react-icons/fc";
import BrandIdentity from "./BrandIdentity.jsx";
export default function Signup() {
  const navigate = useNavigate()
 const dispatch=useDispatch()
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [mobile, setmobile] = useState('')
  const [role, setrole] = useState('Customer')
  const[gender,setgender]=useState("Male")
  const [photourl, setphotourl] = useState('')
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [showpassword, setshowpassword] = useState(false);
  useEffect(() => {
    if (error) seterror('')
  }, [username, email, password, mobile, role, photourl])

  const handlefilechange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setphotourl(reader.result)
    reader.readAsDataURL(file)
  }
const googlesignup = async () => {
  try {
    if (!mobile || !role || !gender) {
      return alert("⚠️ Mobile, Role ,Gender are required before Google signup.");
    }

    setloading(true);

    const provider = new GoogleAuthProvider();

    // 🔥 Proper clean popup call
    const result = await signInWithPopup(Auth, provider).catch((err) => {
      if (
        err.code === "auth/cancelled-popup-request" ||
        err.code === "auth/popup-closed-by-user"
      ) {
        alert("Google signup popup closed.");
        return null;
      }
      throw err;
    });

    if (!result) {
      setloading(false);
      return;
    }

    const user = result.user;

    // 🌟 Professional backend communication
    const { data } = await axios.post(
      `${serverurl}/auth/googlesignup`,
      {
        username: user.displayName,
        email: user.email,
        mobile: mobile,
        role: role,
        gender
      },
      { withCredentials: true }
    );

    if (data?.success && data?.user) {
      dispatch(setUserData(data.user));

      alert(" Google Signup Successful!");
      navigate("/");
    } else {
      alert(data.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("GOOGLE SIGNUP ERROR:", error);

    alert(
      `❌ Google Signup Failed:\n${
        error.response?.data?.message || error.message
      }`
    );
  } finally {
    setloading(false);
  }
};

  const handlesignup = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')

    if (!username || !email || !password || !role || !gender) {
      seterror('please fill all required fields')
      setloading(false)
      return
    }

    try {
      const payload = { username, email, password, mobile,  role,gender }

      const res = await axios.post(
        `${serverurl}/auth/signup`,
        payload,
        { withCredentials: true }
      )
      if (res?.data?.success && res?.data?.user) {
        dispatch(setUserData(res.data.user));
        alert('Signup successful — welcome to e-laundry!')
        navigate('/')
      } else {
        seterror(res?.data?.message || 'signup failed')
      }
    } catch (err) {
      console.log(err?.response?.data)
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-emerald-50 to-emerald-100 p-4
      xl:p-12 overflow-y-auto">

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl 
        bg-white shadow-2xl rounded-3xl 
        p-6 sm:p-10
        grid grid-cols-1 lg:grid-cols-2 gap-8"
      >

        {/* left hero section */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center gap-4"
        >
          <BrandIdentity
            title="E-Laundry"
            subtitle="Create your account in seconds"
            titleClassName="text-2xl sm:text-3xl text-emerald-900"
            subtitleClassName="text-sm text-emerald-700"
            logoClassName="h-12 w-12 sm:h-14 sm:w-14"
          />

          <h3 className="text-3xl xl:text-4xl font-semibold text-emerald-800 leading-tight">
            E-laundry  Shop— Clean Clothes, Happy Life!
          </h3>

          <p className="text-sm xl:text-base text-emerald-600">
           Fast Pickup ,High Quality Detargent and Super Qualityfull Service Makes Us Unique
          </p>

          <ul className="mt-4 space-y-2 text-sm xl:text-base text-emerald-600">
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>• Proffessional Pickup and Delivery</motion.li>
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>• Secure Online Payment</motion.li>
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>• 24/7 Customer Service</motion.li>
          </ul>
        </motion.div>

        {/* right form section */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-emerald-50/40 rounded-2xl p-6 md:p-8 backdrop-blur-lg"
        >
           
             <div className='flex justify-center items-center w-full mt-4'>




               <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={googlesignup}
            className="flex items-center justify-center gap-3 w-full sm:w-[300px] py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:shadow-md transition-all duration-300 mb-6"
          >
            <FcGoogle className="text-2xl" /> Signup with Google
          </motion.button>
             </div>


          <h4 className="text-xl xl:text-2xl font-medium text-emerald-800 mb-6">Create Account</h4>
         
          
          <form onSubmit={handlesignup} className="flex flex-col gap-4">

            {/* animated input */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              value={username} onChange={(e)=>setusername(e.target.value)}
              placeholder="Fullname"
              className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={email} onChange={(e)=>setemail(e.target.value)}
              placeholder=" Enter Your Valid Email"
              type="email"
              className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={password} onChange={(e)=>setpassword(e.target.value)}
              placeholder="Enter An Strong Password "
               type={!showpassword ? "password" : "text"}
              className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white"
            />
                  <button
            type="button"
            className="absolute right-11 top-[48%] text-green-700  text-xl cursor-pointer"
            onClick={() => setshowpassword(prev => !prev)}
          >
            {!showpassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>

            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={mobile} onChange={(e)=>setmobile(e.target.value)}
              placeholder="Enter Your Active Number"
              className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white"
            />

            <div className="flex items-center gap-2">
              <label className="text-sm text-emerald-700">Role</label>
              <select
                value={role}
                onChange={(e)=>setrole(e.target.value)}
                className="rounded-lg p-2 border border-emerald-200 bg-white"
              >
                <option  className='cursor-pointer'     value="Customer">Customer</option>
                <option   className='cursor-pointer'  value="DeliveryBoy">DeliveryBoy</option>
              </select>
            </div>
           <div className="flex items-center gap-2">
              <label className="text-sm text-emerald-700">Gender</label>
              <select
                value={gender}
                onChange={(e)=>setgender(e.target.value)}
                className="rounded-lg p-2 border border-emerald-200 bg-white cursor-pointer"
              >
                <option  className='cursor-pointer'     value="Male">Male</option>
                <option   className='cursor-pointer'  value="Female">Female</option>
                <option   className='cursor-pointer'  value="Others">Others</option>
              </select>
            </div>
            {/* <div>
              <label className="text-sm text-emerald-600 block mb-1">Profile Photo</label>
              <input type="file" accept="image/*" onChange={handlefilechange} />
              {photourl && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={photourl}
                  className="mt-2 w-24 h-24 object-cover rounded-md border shadow"
                />
              )}
            </div> */}

            {error && <div className="text-sm text-rose-600">{error}</div>}

            {/* animated button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              disabled={loading}
              type="submit"
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-medium shadow-lg cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            <div className="text-xs text-emerald-600 text-center mt-2">
              Already Have an Account?
              <button type="button" onClick={()=>navigate('/signin')} className="underline ml-1 cursor-pointer">Signin</button>
            </div>

          </form>
        </motion.div>

      </motion.div>
    </div>
  )
}
