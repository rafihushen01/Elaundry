import react from 'react'
import { useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverurl } from '../App'
import BrandIdentity from './BrandIdentity.jsx'

export default function forgetpassword() {
  const navigate = useNavigate()

  const [step, setstep] = useState(1)
  const [email, setemail] = useState('')
  const [otp, setotp] = useState('')
  const [newpass, setnewpass] = useState('')
  const [confirmpass, setconfirmpass] = useState('')
  const [loading, setloading] = useState(false)
  const [success, setsuccess] = useState(false)
  const [error, seterror] = useState('')

  // green theme
  const primarycolor = '#00c853' // bright emerald
  const hovercolor = '#1b5e20' // dark emerald

  useEffect(() => {
    // clear errors when user types
    if (error) seterror('')
  }, [email, otp, newpass, confirmpass])

  // small UI helpers
  const buttonStyle = (isLoading) => ({
    background: isLoading ? 'linear-gradient(90deg, rgba(167,255,193,1), rgba(200,255,218,1))' : primarycolor,
    boxShadow: '0 6px 18px rgba(0, 200, 83, 0.18)',
  })

  // send otp
  const handlesendotp = async () => {
    if (!email) {
      seterror('please enter your email')
      return
    }
    try {
      setloading(true)
      const result = await axios.post(`${serverurl}/auth/sendotp`, { email })
      if (result?.data?.success) {
        setstep(2)
      } else {
        seterror(result?.data?.message || 'failed to send otp')
      }
    } catch (err) {
      console.log('send otp err', err?.response || err)
      seterror('something went wrong, try again')
    } finally {
      setloading(false)
    }
  }

  // verify otp
  const handleverifyotp = async () => {
    if (!otp) {
      seterror('enter otp')
      return
    }
    try {
      setloading(true)
      const result = await axios.post(`${serverurl}/auth/verifyotp`, { email, otp })
      if (result?.data?.success) {
        setstep(3)
      } else {
        seterror(result?.data?.message || 'invalid otp')
      }
    } catch (err) {
      console.log('verify otp err', err?.response || err)
      seterror(err?.response?.data?.message || 'verification failed')
    } finally {
      setloading(false)
    }
  }

  // reset pass
  const handleresetpass = async () => {
    if (newpass !== confirmpass) {
      seterror('passwords do not match')
      return
    }
    if (newpass.length < 8) {
      seterror('password must be at least 8 characters')
      return
    }

    try {
      setloading(true)
      const result = await axios.post(`${serverurl}/auth/resetpass`, { email, newpass })
      if (result?.data?.success) {
        // show success animation then navigate
        setsuccess(true)
        setTimeout(() => {
          setsuccess(false)
          navigate('/signin')
        }, 1400)
      } else {
        seterror(result?.data?.message || 'reset failed')
      }
    } catch (err) {
      console.log('reset err', err?.response || err)
      seterror('something went wrong')
    } finally {
      setloading(false)
    }
  }

  // animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const fieldVariant = {
    hidden: { opacity: 0, x: 40 },
    visible: (i = 0) => ({ opacity: 1, x: 0, transition: { delay: 0.06 * i, duration: 0.36 } }),
  }

  const bubbleProps = (size, left, delay, duration) => ({
    initial: { y: -40, opacity: 0 },
    animate: { y: [ -40, 40, -20 ], opacity: [0, 0.18, 0.05], x: 0 },
    transition: { repeat: Infinity, repeatType: 'loop', duration: duration || 8, delay: delay || 0 },
    style: {
      width: size,
      height: size,
      left,
      background: 'linear-gradient(135deg, rgba(0,200,83,0.12), rgba(0,150,60,0.06))',
      borderRadius: '999px',
      position: 'absolute',
      filter: 'blur(8px)',
      pointerEvents: 'none',
    },
  })

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
      {/* floating bubbles */}
      <motion.div {...bubbleProps(220, '6%', 0, 12)} />
      <motion.div {...bubbleProps(140, '75%', 2, 9)} />
      <motion.div {...bubbleProps(90, '38%', 1, 10)} />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 overflow-hidden"
        style={{ border: '1px solid rgba(6,95,70,0.04)' }}
      >
        {/* subtle glowing border */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 6px 40px rgba(0,200,83,0.06)`,
            border: `1px solid rgba(0,200,83,0.06)`,
            mixBlendMode: 'screen',
          }}
        />

        <BrandIdentity
          title="E-Laundry"
          subtitle="Password Recovery"
          className="mb-5 relative z-10"
          titleClassName="text-2xl text-emerald-900"
          subtitleClassName="text-sm text-emerald-700"
          logoClassName="h-12 w-12"
        />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <IoMdArrowRoundBack
            size={26}
            className="text-emerald-600 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate('/signin')}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">Forget  Password</h1>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 - email */}
          {step === 1 && !success && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.45 }}
              className="relative z-10"
            >
              <motion.label className="block text-sm md:text-base font-medium text-emerald-700 mb-2" variants={fieldVariant} initial="hidden" animate="visible">
              Email
              </motion.label>

              <motion.input
                custom={1}
                variants={fieldVariant}
                initial="hidden"
                animate="visible"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-lg px-3 py-3 outline-none text-sm border border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 bg-white transition"
                style={{ boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.02)' }}
              />

              {error && <div className="text-xs text-rose-600 mt-2">{error}</div>}

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                onClick={handlesendotp}
                disabled={loading}
                style={buttonStyle(loading)}
                className="w-full mt-4 py-2 rounded-xl text-white font-semibold transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(90deg, ${hovercolor}, ${primarycolor})`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = primarycolor)}
              >
                {loading ? 'Sending...' : 'Send Otp'}
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2 - otp */}
          {step === 2 && !success && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="relative z-10"
            >
              <motion.label className="block text-sm md:text-base font-medium text-emerald-700 mb-2">Enter Otp</motion.label>

              <motion.input
                value={otp}
                onChange={(e) => setotp(e.target.value)}
                type="text"
                placeholder="6-digit Otp"
                className="w-full rounded-lg px-3 py-3 outline-none text-sm border border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 bg-white transition"
              />

              <div className="flex gap-2 mt-4">
                <motion.button
                  onClick={() => setstep(1)}
                  className="flex-1 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-medium"
                >
                  back
                </motion.button>

                <motion.button
                  onClick={handleverifyotp}
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  style={buttonStyle(loading)}
                  className="flex-1 py-2 rounded-xl text-white font-semibold"
                  onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(90deg, ${hovercolor}, ${primarycolor})`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = primarycolor)}
                >
                  {loading ? 'Verifying...' : 'Verify otp'}
                </motion.button>
              </div>

              {error && <div className="text-xs text-rose-600 mt-3">{error}</div>}
            </motion.div>
          )}

          {/* STEP 3 - reset */}
          {step === 3 && !success && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.45 }}
              className="relative z-10"
            >
              <motion.label className="block text-sm md:text-base font-medium text-emerald-700 mb-2">New Password</motion.label>
              <motion.input
                value={newpass}
                onChange={(e) => setnewpass(e.target.value)}
                type="password"
                placeholder="Enter Strong New Password"
                className="w-full rounded-lg px-3 py-3 outline-none text-sm border border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 bg-white transition"
              />

              <motion.label className="block text-sm md:text-base font-medium text-emerald-700 mt-4 mb-2">Confirm Password</motion.label>
              <motion.input
                value={confirmpass}
                onChange={(e) => setconfirmpass(e.target.value)}
                type="password"
                placeholder="re-enter new password"
                className="w-full rounded-lg px-3 py-3 outline-none text-sm border border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 bg-white transition"
              />

              <motion.button
                onClick={handleresetpass}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                style={buttonStyle(loading)}
                className="w-full mt-5 py-2 rounded-xl text-white font-semibold transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.background = `linear-gradient(90deg, ${hovercolor}, ${primarycolor})`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = primarycolor)}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>

              {error && <div className="text-xs text-rose-600 mt-3">{error}</div>}
            </motion.div>
          )}

          {/* SUCCESS animation */}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.12, 1] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="rounded-full bg-emerald-50 p-4"
                style={{ boxShadow: '0 8px 30px rgba(0,200,83,0.12)' }}
              >
                <svg className="w-16 h-16 text-emerald-700" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              <motion.h3 className="mt-4 text-emerald-800 font-semibold text-lg">Password reset!</motion.h3>
              <motion.p className="text-sm text-emerald-600 mt-1">You will be redirected to signin</motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* footer hint */}
        <div className="mt-5 text-xs text-emerald-400 text-center relative z-10">
          Need help? contact support@e-laundry.com
        </div>
      </motion.div>
    </div>
  )
}
