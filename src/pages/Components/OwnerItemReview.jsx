import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { serverurl } from "../../App";
import { toast } from "react-hot-toast";

const OwnerItemReview = () => {
  const { id } = useParams(); // itemid
  const navigate = useNavigate();

  const [reviews, setreviews] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${serverurl}/review/item/${id}`, {
        withCredentials: true,
      });
      setreviews(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setloading(false);
    }
  };

  // Average & statistics
  const calcAvg = () => {
    let ironTotal = 0,
      ironCount = 0,
      washTotal = 0,
      washCount = 0;

    reviews.forEach((r) => {
      if (typeof r.ironRating === "number") {
        ironTotal += r.ironRating;
        ironCount++;
      }
      if (typeof r.washRating === "number") {
        washTotal += r.washRating;
        washCount++;
      }
    });

    return {
      ironAvg: ironCount ? (ironTotal / ironCount).toFixed(1) : 0,
      washAvg: washCount ? (washTotal / washCount).toFixed(1) : 0,
      ironCount,
      washCount,
    };
  };

  const stats = calcAvg();

  // Star bar (for UI beauty)
  const StarBar = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mb-6 rounded-xl bg-white shadow hover:bg-gray-100"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Item Review Overview
        </h1>

        {/* Stats Section */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl border mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Overall Performance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Iron Stats */}
            <div className="p-4 rounded-xl bg-green-50 border">
              <h3 className="font-bold text-gray-700 mb-2">Iron Service</h3>
              <div className="text-4xl font-extrabold text-green-600">{stats.ironAvg}</div>
              <p className="text-gray-500 text-sm">{stats.ironCount} total ratings</p>
              <StarBar rating={Math.round(stats.ironAvg)} />
            </div>

            {/* Wash Stats */}
            <div className="p-4 rounded-xl bg-blue-50 border">
              <h3 className="font-bold text-gray-700 mb-2">Wash Service</h3>
              <div className="text-4xl font-extrabold text-blue-600">{stats.washAvg}</div>
              <p className="text-gray-500 text-sm">{stats.washCount} total ratings</p>
              <StarBar rating={Math.round(stats.washAvg)} />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">All Customer Reviews</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 bg-white rounded-2xl shadow border text-center text-gray-500"
          >
            No reviews yet for this item.
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 bg-white rounded-2xl shadow border"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-bold text-gray-800">
                      {r.userid?.username || "User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.userid?.email} • {r.userid?.mobile}
                    </div>
                  </div>
                </div>

                {/* Iron Review */}
                {typeof r.ironRating === "number" && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <span>Iron Rating:</span>
                      <StarBar rating={r.ironRating} />
                      <span className="text-gray-700 font-bold">{r.ironRating}</span>
                    </div>
                    {r.ironReview && (
                      <p className="text-sm text-gray-700 mt-1">{r.ironReview}</p>
                    )}
                  </div>
                )}

                {/* Wash Review */}
                {typeof r.washRating === "number" && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      <span>Wash Rating:</span>
                      <StarBar rating={r.washRating} />
                      <span className="text-gray-700 font-bold">{r.washRating}</span>
                    </div>
                    {r.washReview && (
                      <p className="text-sm text-gray-700 mt-1">{r.washReview}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OwnerItemReview;
