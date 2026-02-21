import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector, useDispatch } from "react-redux";
import { setAddress, setLocation } from "../redux/MapSlice";
import { FaSearch, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaShoppingCart } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../../App.jsx";
import toast from "react-hot-toast";
import ShopSelector from "./Shopselectior.jsx";
// === CART ITEM COOL UI RENDER (ADDED) ===
// Below component added to show cart items beautifully
const CartItemCard = ({ item }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-4 mb-4 flex items-center gap-4 border border-green-200">
      <img
        src={item?.itemid?.image}
        alt={item?.itemid?.name}
        className="w-20 h-20 rounded-xl object-cover shadow"
      />
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-green-700">{item?.itemid?.name}</h2>
        <p className="text-gray-500 text-sm">Base Price: {item?.itemid?.price}৳</p>

        <div className="mt-1 text-sm">
          {item?.services?.iron?.price ? (
            <p className="text-green-600">Iron: {item.services.iron.price}৳ x {item.services.iron.quantity}</p>
          ) : null}

          {item?.services?.wash?.washingprice ? (
            <p className="text-blue-600">Wash: {item.services.wash.washingprice}৳ x {item.services.wash.quantity}</p>
          ) : null}
        </div>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-green-700">{item?.totalprice}৳</p>
        <p className="text-xs text-gray-400">Updated: {new Date(item?.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

// green marker (simple svg data url) to match theme
const greenMarkerUrl =
  "data:image/svg+xml;utf8,\n<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%2300A86B'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z'/></svg>";

const customIcon = new L.Icon({
  iconUrl: greenMarkerUrl,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -36],
});

const Recentermap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location?.lat && location?.lon) map.flyTo([location.lat, location.lon], 15, { animate: true });
  }, [location, map]);
  return null;
};

const getcurrentaddress = async (lat, lon, dispatch) => {
  try {
    const res = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEO_API}`
    );
    const formatted = res?.data?.results?.[0]?.formatted || "Unknown location";
    dispatch(setAddress(formatted));
  } catch (err) {
    console.error("reverse geocode error", err?.message || err);
  }
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // safe selectors with defaults
  const mapState = useSelector((s) => s.map || { location: { lat: 23.7808875, lon: 90.2792371 }, address: "" });
  const userState = useSelector((s) => s.user || {});
  const currentcartiems = userState.currentcartiems || [];

  const [shops, setshops] = useState([]);
  const [selectedShop, setselectedShop] = useState("");
  const [addressinput, setaddressinput] = useState(mapState.address || "");
  const [delmobile, setdelmobile] = useState(userState?.userData?.mobile || "");
  const [paymentmethod, setpaymentmethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  const location = mapState.location || { lat, lon};

  // fetch shops for selection (if your backend route is different, update url)
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(`${serverurl}/shop/all`, { withCredentials: true });
        setshops(res.data?.data || res.data?.shops || []);
        console.log(shops)
        if ((res.data?.data || res.data?.shops || []).length > 0) {
          setselectedShop((res.data?.data || res.data?.shops || [])[0]._id);
        }
      } catch (err) {
        console.warn("could not fetch shops", err?.message || err);
      }
    };
    fetchShops();
  }, []);

  // keep input in sync with redux address
  useEffect(() => {
    if (mapState.address) setaddressinput(mapState.address);
  }, [mapState.address]);

  const ondragend = async (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    await getcurrentaddress(lat, lng, dispatch);
  };

  const getlatlangbyaddress = async () => {
    try {
      setSearchingAddress(true);
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressinput)}&format=json&apiKey=${import.meta.env.VITE_GEO_API}`
      );
      const loc = result?.data?.results?.[0];
      if (loc?.lat && loc?.lon) {
        dispatch(setLocation({ lat: loc.lat, lon: loc.lon }));
        dispatch(setAddress(loc.formatted));
      } else {
        alert("No matching address found");
      }
    } catch (err) {
      console.error("address search failed", err?.message || err);
      alert("Address search failed");
    } finally {
      setSearchingAddress(false);
    }
  };

  const getcurrentlocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
          await getcurrentaddress(latitude, longitude, dispatch);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          alert("Unable to get current location");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation not supported");
      setLoading(false);
    }
  };

  // compute totals from cart items (backend expects numbers)
  const subtotal = currentcartiems.reduce((acc, it) => {
    const price = Number(it.price || it.totalprice || 0);
    const qty = Number(it.quantity || 1);
    return acc + price * qty;
  }, 0);
  const deliveryfee = 0;
  const totalamountwithdeliveryfee = subtotal + deliveryfee;

  const handleplaceorder = async () => {
    try {
      if (!selectedShop) return alert("Please select a shop");
      if (!delmobile) return alert("Enter your delivery mobile number");
      if (!addressinput) return alert("Enter delivery address");

      setLoading(true);
      const payload = {
        shopid: selectedShop,
        deliveryaddress: addressinput,
        delmobile,
        paymentmethod,
      };

      const res = await axios.post(`${serverurl}/order/place`, payload, { withCredentials: true });

      if (res?.data?.success || res?.data?.message === "Order placed successfully") {
        toast.success("Order placed — thank you!");
        navigate("/placeorder");
      } else {
        alert(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err?.response?.data || err?.message || err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eefaf3] to-[#e6fff0] p-5">
      <motion.div
        className="w-full max-w-[1000px] bg-white/80 rounded-2xl shadow-xl border border-white/40 p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-center text-[#007a4d]">E-Laundry Checkout</h1>

        {/* Shop selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Shop</label>
     
            <ShopSelector shops={shops} />
        </div>

        {/* Address + map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Delivery Address</label>
            <div className="flex gap-2">
              <input
                value={addressinput}
                onChange={(e) => setaddressinput(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none"
                placeholder="Type address or search"
              />
              <button onClick={getlatlangbyaddress} className="px-4 rounded-xl bg-[#00a86b] text-white flex items-center gap-2">
                {searchingAddress ? "Searching..." : <FaSearch />}
              </button>
              <button onClick={getcurrentlocation} className="px-4 rounded-xl bg-[#008b5a] text-white flex items-center gap-2">
                {loading ? "..." : <BiCurrentLocation />}
              </button>
            </div>

            <input
              type="tel"
              placeholder="Delivery mobile"
              value={delmobile}
              onChange={(e) => setdelmobile(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200"
            />

            <div className="mt-2">
              <label className="text-sm font-medium">Map (Drag the icons to get your address )</label>
              <div className="h-[280px] rounded-xl overflow-hidden mt-2 border">
                <MapContainer center={[location.lat, location.lon]} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Recentermap location={location} />
                  <Marker position={[location.lat, location.lon]} icon={customIcon} draggable eventHandlers={{ dragend: ondragend }} />
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Payment + cart summary */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[{ key: "Cash", icon: <FaMoneyBillWave /> }, { key: "Card", icon: <FaCreditCard /> }, { key: "Bikash", icon: <FaMobileAlt /> }, { key: "Nagad", icon: <FaMobileAlt /> }].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setpaymentmethod(m.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${paymentmethod === m.key ? "bg-[#00a86b] text-white" : "bg-white"}`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="font-semibold">{m.key}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/60 p-4 rounded-xl shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <FaShoppingCart className="text-[#007a4d]" />
                <h3 className="font-semibold">Cart Summary</h3>
              </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto p-2">
  {currentcartiems.length > 0 ? (
    currentcartiems.map((it, idx) => {
      const itemimage = it.itemid.image;
      const itemname = it.itemid?.name || it.itemName || "Item";
     
      const baseprice = Number(it.itemid.price || 0);
      const washbaseprice=Number(it.itemid.washprice )
      // const totalbaseprice = Number(baseprice * itemqty);

      const ironqty = it.services?.iron?.quantity || 0;
      const ironprice = it.services?.iron?.price || 0;
      const ironamount = ironprice;

      const washqty = it.services?.wash?.quantity || 0;
      const washprice = it.services?.wash?.washingprice || 0;
      const washamount =  washprice;

      const total = Number(it.totalprice || 0) 

      return (
        <div
          key={idx}
          className="flex gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          {/* IMAGE */}
          <img
            src={itemimage}
            alt={itemname}
            className="w-16 h-16 rounded-lg object-cover border"
          />

          {/* DETAILS */}
          <div className="flex-1">
            {/* NAME + QTY */}
            <div className="flex justify-between">
              <div className="font-semibold text-gray-800 text-lg">{itemname}</div>
           
            </div>

            {/* BASE PRICE */}
            <div className="text-sm text-gray-700 mt-1">
              Base Price for Iron: <span className="font-semibold text-green-600">{baseprice}</span>
            </div>
        <div className="text-sm text-gray-700 mt-1">
              Base Price Wash: <span className="font-semibold text-green-600">{washbaseprice}</span>
            </div>
            {/* SERVICES */}
            <div className="mt-2 space-y-1">
              {/* Iron Service */}
              {ironqty > 0 && (
                <div className="flex justify-between text-sm bg-green-50 p-1.5 rounded-md">
                  <span>Iron × {ironqty}</span>
                  <span className="font-semibold">{ironamount}</span>
                </div>
              )}

              {/* Wash Service */}
              {washqty > 0 && (
                <div className="flex justify-between text-sm bg-green-50 p-1.5 rounded-md">
                  <span>Wash × {washqty}</span>
                  <span className="font-semibold">{washamount}</span>
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-3 border-t pt-2">
              <span className="text-sm text-gray-700 font-medium">Total:</span>
              <span className="text-lg font-bold text-green-700">{total}</span>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center text-gray-500 italic">No items in cart</div>
  )}
</div>


              <div className="mt-4 border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>Delivery</span>
                  <span>{deliveryfee === 0 ? "Free" : deliveryfee}</span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{totalamountwithdeliveryfee}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleplaceorder}
                className="w-full mt-4 py-3 rounded-xl bg-[#007a4d] text-white font-bold"
                disabled={loading}
              >
                {paymentmethod === "Cash" ? "Place Order" : "Pay & Place Order"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
