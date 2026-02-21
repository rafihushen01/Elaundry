// components/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverurl } from "../../App.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingCart, FaTrash, FaSave } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCartItems, setTotalAmount } from "../redux/Userslice.js";

// লোগো ইমপোর্ট (আপনার রিকুয়েস্ট অনুযায়ী)
import elaundrylogo from "../../../public/Elaundry.png";

const Cart = () => {
  const [cart, setcart] = useState([]);
  const [grandtotal, setgrandtotal] = useState(0);
  const [loading, setloading] = useState(true);
  
  const { userData, currentcartiems } = useSelector((s) => s.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCart = async () => {
    setloading(true);
    try {
      const res = await axios.get(`${serverurl}/cart/all`, { withCredentials: true });
      const fetchedCart = res.data.cart || [];
      
      setcart(fetchedCart);
      dispatch(setCurrentCartItems(fetchedCart));
      
      const total = res.data.grandtotal || 0;
      setgrandtotal(total);
      dispatch(setTotalAmount(total));
    } catch (err) {
      console.error(err?.response?.data || err?.message);
      // toast.error("Failed to load cart");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateLine = async (line) => {
    try {
      const payload = {
        cartid: line._id,
        services: { 
          iron: line.services?.iron?.quantity || 0, 
          wash: line.services?.wash?.quantity || 0 
        },
      };
      const res = await axios.put(`${serverurl}/cart/update`, payload, { withCredentials: true });
      await fetchCart(); // আপডেট করার পর আবার ডাটা ফেচ করে নিচ্ছি রিফ্রেশ দেখানোর জন্য
      toast.success(res.data.message || "Cart Updated Successfully ✨");
    } catch (err) {
      console.error(err?.response?.data || err?.message);
      toast.error("Update failed");
    }
  };

  const removeLine = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await axios.delete(`${serverurl}/cart/delete/${id}`, { withCredentials: true });
      await fetchCart();
      toast.success("Item Removed 🗑️");
    } catch (err) {
      console.error(err?.response?.data || err?.message);
      toast.error("Delete failed");
    }
  };

  // + এবং - বাটনের জন্য ফাংশন
  const changeServiceQty = (id, service, delta) => {
    setcart((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
              ...c,
              services: {
                ...c.services,
                [service]: {
                  ...c.services[service],
                  quantity: Math.max(0, (c.services[service]?.quantity || 0) + delta),
                },
              },
            }
          : c
      )
    );
  };

  // সরাসরি টাইপ করার জন্য ফাংশন
  const handleManualQty = (id, service, value) => {
    const parsed = parseInt(value, 10);
    const finalVal = isNaN(parsed) ? 0 : Math.max(0, parsed);
    
    setcart((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
              ...c,
              services: {
                ...c.services,
                [service]: {
                  ...c.services[service],
                  quantity: finalVal,
                },
              },
            }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4 md:px-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-white">
          <div className="flex items-center gap-4">
            <img src={elaundrylogo} alt="eLaundry Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md" />
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-green-800 flex items-center gap-3">
                <FaShoppingCart className="text-green-600" /> My Cart
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                Welcome back, {userData?.gender === "Male" ? "Mr." : "Ms."} {userData?.username || "Guest"}!
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-white"
          >
            <FaShoppingCart className="text-gray-300 text-7xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-500 mb-2">Your cart is empty</h2>
            <p className="text-gray-400">Looks like you haven't added any laundry items yet.</p>
            <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors shadow-md">
              Browse Items
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1 space-y-6">
              <AnimatePresence>
                {cart.map((c) => {
                  const it = c.itemid || {};
                  return (
                    <motion.div
                      key={c._id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                    >
                      {/* Product Image */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-green-200 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <img src={it.image} alt={it.name} className="w-32 h-32 sm:w-28 sm:h-28 object-cover rounded-xl relative z-10 shadow-sm" />
                      </div>

                      {/* Details & Qty Adjusters */}
                      <div className="flex-1 w-full text-center sm:text-left">
                        <h2 className="font-bold text-xl text-gray-800">{it.name}</h2>
                        <div className="text-sm font-medium text-gray-500 mt-1 mb-4 flex justify-center sm:justify-start gap-3">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Iron: ৳ {it.price}</span>
                          <span className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md">Wash: ৳ {it.washingprice}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {["iron", "wash"].map((s) => (
                            <div key={s} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                              <span className="text-sm font-semibold text-gray-600 w-10 capitalize">{s}:</span>
                              <button onClick={() => changeServiceQty(c._id, s, -1)} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors">
                                <FaMinus className="text-xs" />
                              </button>
                              
                              <input 
                                type="number" 
                                min="0"
                                value={c.services?.[s]?.quantity === 0 ? "" : c.services?.[s]?.quantity} 
                                placeholder="0"
                                onChange={(e) => handleManualQty(c._id, s, e.target.value)}
                                className="w-10 text-center bg-transparent border-b-2 border-transparent focus:border-green-500 outline-none font-bold text-gray-800 transition-colors hide-arrows"
                              />

                              <button onClick={() => changeServiceQty(c._id, s, 1)} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors">
                                <FaPlus className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="flex flex-col sm:items-end justify-between h-full gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-center sm:text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <div className="font-extrabold text-2xl text-green-700">৳ {c.totalprice || 0}</div>
                        </div>
                        
                        <div className="flex gap-2 justify-center w-full">
                          <button 
                            onClick={() => updateLine(c)} 
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-100 hover:bg-green-600 text-green-700 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            title="Save Changes"
                          >
                            <FaSave /> <span className="sm:hidden">Save</span>
                          </button>
                          <button 
                            onClick={() => removeLine(c._id)} 
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            title="Remove Item"
                          >
                            <FaTrash /> <span className="sm:hidden">Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-80 h-fit sticky top-6">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h3>
                
                <div className="flex justify-between items-center mb-3 text-gray-600">
                  <span>Total Items:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 text-gray-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-800">Grand Total</span>
                    <span className="text-3xl font-extrabold text-green-700">৳ {grandtotal}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/checkout")} 
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  *Please make sure to click the save icon if you change quantities before checking out.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;