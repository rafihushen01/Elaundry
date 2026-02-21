import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopSelector({ shops }) {
  const [selectedShop, setSelectedShop] = useState("");
  const [open, setOpen] = useState(false);

  const selectedShopInfo = shops.find((s) => s._id === selectedShop);

  return (
    <div className="w-full flex flex-col gap-5 mt-5">

      {/* LABEL */}
      <label className="block text-lg font-bold text-gray-800 mb-1">
        Choose An Shop
      </label>

      {/* CUSTOM DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full p-4 rounded-xl border border-gray-300 bg-white flex justify-between items-center shadow hover:shadow-lg transition-all"
        >
          <span className="font-semibold text-gray-700">
            {selectedShopInfo
              ? `${selectedShopInfo.name} — ${selectedShopInfo.branch || selectedShopInfo.city}`
              : "Select a Shop"}
          </span>
          <span className="text-gray-500 text-xl">▾</span>
        </button>

        {/* DROPDOWN LIST */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-auto"
            >
              {shops.length > 0 ? (
                shops.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => {
                      setSelectedShop(s._id);
                      setOpen(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-gray-100 flex gap-3 items-center border-b"
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-lg">
                        {s.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {s.branch || s.address || "Unknown Location"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {s.city} — {s.state}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center">No shops available</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SELECTED SHOP DETAILS PANEL */}
      <AnimatePresence>
        {selectedShopInfo && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            className="w-full p-5 rounded-2xl bg-white shadow-2xl border border-gray-200"
          >
            <h2 className="text-xl font-extrabold text-gray-700 mb-4 underline">
              Shop Details
            </h2>

            <div className="flex gap-5">
              <img
                src={selectedShopInfo.image}
                className="w-40 h-40 rounded-xl object-cover border shadow"
                alt={selectedShopInfo.name}
              />

              <div className="flex flex-col gap-2 text-gray-700 text-lg">
                <p><strong>Name:</strong> {selectedShopInfo.name}</p>
                <p><strong>Branch:</strong> {selectedShopInfo.branch}</p>
                <p><strong>City:</strong> {selectedShopInfo.city}</p>
                <p><strong>State:</strong> {selectedShopInfo.state}</p>
                <p><strong>Address:</strong> {selectedShopInfo.address}</p>
                <p><strong>Email:</strong> {selectedShopInfo.email}</p>
                <p><strong>Mobile:</strong> {selectedShopInfo.mobile}</p>

                <p className="text-sm text-gray-500 mt-2">
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedShopInfo.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedShopInfo.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
