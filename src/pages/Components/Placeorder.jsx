import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Placeorder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eefaf3] to-[#e6fff0] p-5">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-white/40 p-8 text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <FaCheckCircle className="mx-auto text-[#00a86b] text-6xl" />
        <h1 className="text-3xl font-extrabold text-[#007a4d]">Order Placed Successfully!</h1>
        <p className="text-gray-700 font-bold">
          Your clothes are in safe hands. Our delivery executive is on the way to your door.
        </p>
        <motion.div
          className="p-4 bg-green-50 rounded-xl flex items-center justify-center gap-3 border border-green-100"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        >
          <FaShippingFast className="text-[#007a4d] text-2xl" />
          <span className="font-semibold text-green-700 ">
            Please hand over your clothes with care. Your behavior reflects your clan identity.
          </span>
        </motion.div>

        <p className="text-gray-500 italic font-bold">
          Tip: A smile goes a long way. Treat your delivery executive with respect.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="mt-4 w-full py-3 rounded-xl bg-[#007a4d] text-white font-bold  cursor-pointer text-lg"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Placeorder;
