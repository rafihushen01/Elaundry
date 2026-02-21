import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App.jsx";
import { FaTshirt, FaMapMarkerAlt, FaClock, FaTruck, FaCheck } from "react-icons/fa";

const Myorders = () => {
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchorders = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${serverurl}/order/myorders`, {
        withCredentials: true,
      });
     
      setorders(res.data.data || []);
      console.log(res.data)
    } catch (err) {
      console.log(err?.response?.data || err?.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchorders();
  }, []);

  // Status colors
  const statusColor = (s) => {
    switch (s) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "onway":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-6 px-4">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-green-600 mb-6 text-center"
      >
        My Orders
      </motion.h1>

      {loading ? (
        <div className="w-full flex justify-center py-20">
          <div className="animate-spin w-12 h-12 border-t-4 border-green-500 rounded-full"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-xl">
          No orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full p-5 bg-white rounded-2xl shadow-md border border-green-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-semibold text-gray-800">
                  Order ID: <span className="text-green-600">{order._id}</span>
                </p>

                <span
                  className={`px-4 py-1 rounded-full border text-sm font-semibold ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="text-green-600 text-xl" />
                <p class0Name="text-gray-700">
                  {order.deliveryaddress}
                </p>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                {order.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <img
                      src={it.itemid?.image}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold flex items-center gap-2">
                        <FaTshirt className="text-green-600" />
                        {it.itemid?.name}
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        Iron: {it.services.iron.quantity} × {it.itemid?.price} ={" "}
                        <span className="text-green-600 font-semibold">
                          {it.services.iron.price}
                        </span>
                      </p>

                      <p className="text-gray-600 text-sm">
                        Wash: {it.services.wash.quantity} × {it.itemid?.washingprice} ={" "}
                        <span className="text-green-600 font-semibold">
                          {it.services.wash.washingprice}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Tracking */}
              <div className="border-t pt-4 flex justify-between items-center">
                <p className="text-lg font-semibold text-green-600">
                  Total: {order.totalprice}
                </p>

                <button
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
                >
                  <FaTruck />
                  Track Order
                </button>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <p className="text-gray-700 mb-2 font-semibold">Order Timeline</p>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <FaClock className="text-yellow-500 text-xl" />
                    <p className="text-xs mt-1">Pending</p>
                  </div>

                  <div className="h-1 w-10 bg-gray-300"></div>

                  <div className="flex flex-col items-center">
                    <FaTruck className="text-blue-500 text-xl" />
                    <p className="text-xs mt-1">Processing</p>
                  </div>

                  <div className="h-1 w-10 bg-gray-300"></div>

                  <div className="flex flex-col items-center">
                    <FaTruck className="text-purple-500 text-xl" />
                    <p className="text-xs mt-1">On Way</p>
                  </div>

                  <div className="h-1 w-10 bg-gray-300"></div>

                  <div className="flex flex-col items-center">
                    <FaCheck className="text-green-500 text-xl" />
                    <p className="text-xs mt-1">Completed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myorders;
