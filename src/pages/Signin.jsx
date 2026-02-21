// Signin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { serverurl } from "../App";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "./Firebase.jsx";
import { FcGoogle } from "react-icons/fc";
import { setUserData } from "./redux/Userslice.js";
import { useDispatch } from "react-redux";
import { SuperFinalVerification } from "./Superfinalverification.jsx";
import BrandIdentity from "./BrandIdentity.jsx";
export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form fields
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  // UI state
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");

  // superadmin flow state
  const [isSuperFlow, setisSuperFlow] = useState(false);
  const [supEmail, setsupEmail] = useState("");
  const [superStep, setsuperStep] = useState(null); // "otp", "security", "insane", null
  const [otpInput, setotpInput] = useState("");
  const [securityInput, setsecurityInput] = useState("");
  const [insaneInput, setinsaneInput] = useState("");
  const [supCountdown, setsupCountdown] = useState(0);

  useEffect(() => {
    if (error) seterror("");
  }, [email, password]);

  // simple countdown for OTP expiry UX (not authoritative; server controls expiry)
  useEffect(() => {
    let t;
    if (supCountdown > 0) {
      t = setTimeout(() => setsupCountdown((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [supCountdown]);

  const handlesignin = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    setsuccess("");

    if (!email || !password) {
      seterror("Please fill all fields properly");
      setloading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverurl}/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      // server returns either normal login success OR superadmin challenge
      const data = result?.data;

      if (data?.superadmin) {
        // begin superadmin verification flow
        setisSuperFlow(true);
        setsupEmail(email);
        setsuperStep("otp");
        setsupCountdown(300); // UX countdown 5 minutes
        setsuccess("SuperAdmin credentials recognized — please verify OTP sent to email.");
        setloading(false);
        return;
      }

      if (data?.success) {
        // normal login
        const user = data?.user || data?.data?.user;
        if (user) dispatch(setUserData(user));
        setsuccess("Signin successful — welcome back!");
        setTimeout(() => navigate("/"));
      } else {
        seterror(data?.message || "Signin failed");
      }
    } catch (err) {
      console.error("signin error:", err?.response?.data || err.message);
      const msg = err?.response?.data?.message || "Invalid credentials or server error";
      seterror(msg);
    } finally {
      setloading(false);
    }
  };

  // SUPERADMIN: step 1 -> verify OTP
  const verifiesupotp = async (e) => {
    e?.preventDefault();
    if (!otpInput) {
      seterror("Please enter OTP");
      return;
    }
    setloading(true);
    seterror("");
    try {
      const res = await axios.post(
        `${serverurl}/auth/verify-super-otp`,
        { email: supEmail, otp: otpInput },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setsuperStep("security");
        setsuccess("Email OTP verified. Enter the security code.");
      } else {
        seterror(res?.data?.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("verify sup otp err:", err?.response?.data || err.message);
      seterror(err?.response?.data?.message || "OTP verify error");
    } finally {
      setloading(false);
    }
  };

  // SUPERADMIN: step 2 -> verify security code
  const verifiesupersecurity = async (e) => {
    e?.preventDefault();
    if (!securityInput) {
      seterror("Please enter security code");
      return;
    }
    setloading(true);
    seterror("");
    try {
      const res = await axios.post(
        `${serverurl}/auth/verify-super-security`,
        { email: supEmail, securityCode: securityInput },
        { withCredentials: true }

      );
      if (res?.data?.success) {
        setsuperStep("insane");
        setsuccess("Security code accepted. Enter the final insane code.");
      } else {
        seterror(res?.data?.message || "Security code invalid");
      }
    } catch (err) {
      console.error("verify security err:", err?.response?.data || err.message);
      seterror(err?.response?.data?.message || "Security verify error");
    } finally {
      setloading(false);
    }
  };
const resendotp = async (e) => {
  e?.preventDefault();

  if (!supEmail) {
    seterror("Super admin email missing");
    return;
  }

  setloading(true);
  seterror("");
  setsuccess("");

  try {
    const res = await axios.post(
      `${serverurl}/auth/sendsupotp`,
      { email: supEmail },
      { withCredentials: true }
    );

    if (res?.data?.success) {
      setsupCountdown(300); // Reset countdown timer
      setsuccess("OTP resent successfully. Check your email again.");
    } else {
      seterror(res?.data?.message || "Resend OTP failed");
    }
  } catch (err) {
    console.error("Resend OTP error:", err?.response?.data || err.message);
    seterror("Could not resend OTP");
  } finally {
    setloading(false);
  }
};

  // SUPERADMIN: step 3 -> verify insane code & final login
  const verifiesuperinsane = async (e) => {
  e?.preventDefault();
  if (!insaneInput) {
    seterror("Please enter insane code");
    return;
  }
  setloading(true);
  seterror("");
  try {
    const res = await axios.post(
      `${serverurl}/auth/super-final`,
      { email: supEmail, insaneCode: insaneInput },
      { withCredentials: true }
    );

    if (res?.data?.success) {
      // ❗ DO NOT LOGIN HERE
      // ❗ Move to final verification step instead
   
      setsuccess("Insane code verified. Thanks for verifying. Completing login...Mr Rasel Parves");
      navigate("/")
    } else {
      seterror(res?.data?.message || "Final verify failed");
    }
  } catch (err) {
    console.error("verify insane err:", err?.response?.data || err.message);
    seterror(err?.response?.data?.message || "Final verify error");
  } finally {
    setloading(false);
  }
};

  // resend super otp
  const resendSupOtp = async () => {
    if (!supEmail) return;
    setloading(true);
    seterror("");
    try {
      await axios.post(
        `${serverurl}/auth/sendsupotp`,
        { email: supEmail },
        { withCredentials: true }
      );
      setsupCountdown(300);
      setsuccess("OTP resent. Check your super admin email.");
    } catch (err) {
      console.error("resend sup otp err:", err?.response?.data || err.message);
      seterror("Could not resend OTP");
    } finally {
      setloading(false);
    }
  };

  // Google signin (firebase popup -> call backend googlelogin)
  const googlesignin = async () => {
    setloading(true);
    seterror("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(Auth, provider);
      const payload = {
        username: result.user.displayName,
        email: result.user.email,
      };

      const { data } = await axios.post(`${serverurl}/auth/googlelogin`, payload, {
        withCredentials: true,
      });

      if (data?.success) {
        if (data.user) dispatch(setUserData(data.user));
        setsuccess("Google Signin Successful");
        navigate("/");
      } else {
        seterror(data?.message || "Google login failed");
      }
    } catch (err) {
      console.error("google signup error:", err?.response?.data || err.message);
      seterror(err?.response?.data?.message || "Google signin failed");
    } finally {
      setloading(false);
    }
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 xl:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* left hero */}
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center gap-6">
          <BrandIdentity
            title="E-Laundry"
            subtitle="Professional Laundry Platform"
            titleClassName="text-2xl sm:text-3xl text-emerald-900"
            subtitleClassName="text-sm text-emerald-700"
            logoClassName="h-12 w-12 sm:h-14 sm:w-14"
          />

          <h2 className="text-3xl xl:text-4xl font-semibold text-emerald-800">Welcome Back</h2>
          <p className="text-sm xl:text-base text-emerald-600">Fresh clothes, fresh start — log in and continue your clean lifestyle.</p>

          <ul className="space-y-2 text-sm xl:text-base text-emerald-600">
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>• Ultra Fast Pickup & Delivery System</motion.li>
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>• Secure Account Protection</motion.li>
            <motion.li initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>• 24/7 Laundry Tracking</motion.li>
          </ul>
        </motion.div>

        {/* right form */}
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="bg-emerald-50/40 rounded-2xl p-6 md:p-8 backdrop-blur-lg">
          <div className="flex justify-center items-center w-full mt-4">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={googlesignin} className="flex items-center justify-center gap-3 w-full sm:w-[300px] py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:shadow-md transition-all duration-300 mb-6">
              <FcGoogle className="text-2xl" /> SignIn with Google
            </motion.button>
          </div>

          <h3 className="text-xl xl:text-2xl font-medium text-emerald-800 mb-6">SignIn to Your Account</h3>

          <form onSubmit={handlesignin} className="flex flex-col gap-5">
            <motion.input whileFocus={{ scale: 1.02 }} value={email} onChange={(e) => setemail(e.target.value)} placeholder="Enter Your Email" type="email" className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white" />

            <div className="relative w-full">
              <motion.input whileFocus={{ scale: 1.02 }} value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Enter Your Password" type={!showpassword ? "password" : "text"} className="w-full rounded-lg p-3 border border-emerald-200 focus:ring-2 focus:ring-emerald-300 bg-white" />
              <button type="button" className="absolute right-3 top-3 text-green-700 text-xl cursor-pointer" onClick={() => setshowpassword((p) => !p)}>
                {!showpassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}
            {success && <div className="text-sm text-emerald-700">{success}</div>}

            <div className="text-right">
              <button type="button" onClick={() => navigate("/forgetpass")} className="text-sm text-green-600 hover:text-green-700 transition cursor-pointer">Forgot Password?</button>
            </div>

            <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg shadow-md font-medium cursor-pointer">
              {loading ? "Checking..." : "SignIn"}
            </motion.button>

            <div className="text-xs text-emerald-600 text-center mt-2">
              New Here?
              <button type="button" onClick={() => navigate("/signup")} className="underline ml-1 cursor-pointer">Create Account</button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* SUPERADMIN MODAL FLOW */}
      <AnimatePresence>
        {isSuperFlow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} transition={{ duration: 0.18 }} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <h4 className="text-lg font-semibold text-emerald-800 mb-2">Super Admin Verification</h4>
              <p className="text-sm text-emerald-600 mb-4">We detected super-admin credentials. Follow the verification steps to proceed.</p>

              {/* step indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-full text-xs ${superStep === "otp" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>1. Email OTP</div>
                <div className={`px-3 py-1 rounded-full text-xs ${superStep === "security" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>2. Security Code</div>
                <div className={`px-3 py-1 rounded-full text-xs ${superStep === "insane" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>3. Final Insane code</div>
                             {/* <div className={`px-3 py-1 rounded-full text-xs ${superStep === "final" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>4. Final Code</div> */}
              </div>

              {superStep === "otp" && (
                <form onSubmit={verifiesupotp} className="flex flex-col gap-3">
                  <div className="text-sm text-emerald-700">OTP sent to: <span className="font-medium">{supEmail}</span></div>
                  <input value={otpInput} onChange={(e) => setotpInput(e.target.value)} placeholder="Enter OTP" className="w-full rounded-lg p-3 border border-emerald-200 bg-emerald-50" />
                  <div className="flex justify-between items-center">
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Verify OTP</button>
                    <div className="text-sm text-emerald-600">
                      {supCountdown > 0 ? `OTP expires in ${Math.floor(supCountdown / 60)}:${String(supCountdown % 60).padStart(2, "0")}` : "Expired"}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={resendotp} className="text-sm text-emerald-600 underline">Resend OTP</button>
                    <button type="button" onClick={() => { setisSuperFlow(false); setsuperStep(null); }} className="text-sm text-rose-600">Cancel</button>
                  </div>
                </form>
              )}

              {superStep === "security" && (
                <form onSubmit={verifiesupersecurity} className="flex flex-col gap-3">
                  <div className="text-sm text-emerald-600">Enter your security code (provided to super admins).</div>
                  <input value={securityInput} onChange={(e) => setsecurityInput(e.target.value)} placeholder="Security code" className="w-full rounded-lg p-3 border border-emerald-200 bg-emerald-50" />
                  <div className="flex justify-between">
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Verify</button>
                    <button type="button" onClick={() => { setsuperStep("otp"); }} className="text-sm text-emerald-600 underline">Back</button>
                  </div>
                </form>
              )}

              {superStep === "insane" && (
                <form onSubmit={verifiesuperinsane} className="flex flex-col gap-3">
                  <div className="text-sm text-emerald-600">Enter the final insane code to complete authentication.</div>
                  <input value={insaneInput} onChange={(e) => setinsaneInput(e.target.value)} placeholder="Final insane code" className="w-full rounded-lg p-3 border border-emerald-200 bg-emerald-50" />
                  <div className="flex justify-between">
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Complete Login</button>
                    <button type="button" onClick={() => { setsuperStep("security"); }} className="text-sm text-emerald-600 underline">Back</button>
                  </div>
                </form>
              )}

              <div className="mt-4 text-right">
                <button type="button" onClick={() => { setisSuperFlow(false); setsuperStep(null); }} className="text-sm text-emerald-600 underline">Close</button>
              </div>

 {/* {superStep === "final" && (
  <SuperFinalVerification
    email={supEmail}
    onSuccess={() => navigate("/")}
    onCancel={() => setsuperStep("insane")}
  />
)} */}







            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
