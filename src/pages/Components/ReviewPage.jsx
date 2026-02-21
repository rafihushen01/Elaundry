// pages/ReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../../App.jsx";
import { toast } from "react-hot-toast";

const ReviewPage = () => {
  const { itemid, orderid } = useParams();
  const navigate = useNavigate();

  const [item, setitem] = useState(null);
  const [loading, setloading] = useState(true);

  const [ironRating, setironRating] = useState(0);
  const [washRating, setwashRating] = useState(0);
  const [ironText, setironText] = useState("");
  const [washText, setwashText] = useState("");

  useEffect(() => {
    const load = async () => {
      setloading(true);
      try {
        // fetch single item (from /item/all enriched) or call dedicated endpoint if you have it
        const res = await axios.get(`${serverurl}/item/all`, { withCredentials: true });
        const found = (res.data.data || []).find((x) => String(x._id) === String(itemid));
        if (!found) {
          toast.error("Item not found");
          navigate("/");
          return;
        }
        // check eligibility
        const elig = found.userEligibleOrders || [];
        const pick = elig.find((e) => String(e.orderid) === String(orderid));
        if (!pick) {
          toast.error("You are not eligible to review this order/item");
          navigate("/");
          return;
        }
        setitem(found);
      } catch (err) {
        console.error(err?.response?.data || err?.message);
        toast.error("Failed to load");
      } finally {
        setloading(false);
      }
    };
    load();
  }, [itemid, orderid, navigate]);

  const submit = async () => {
    try {
      const payload = { itemid, orderid };
      if (Number(ironRating) > 0) {
        payload.ironRating = Number(ironRating);
        payload.ironReview = ironText;
      }
      if (Number(washRating) > 0) {
        payload.washRating = Number(washRating);
        payload.washReview = washText;
      }
      await axios.post(`${serverurl}/review/add`, payload, { withCredentials: true });
      toast.success("Review submitted");
      navigate(-1);
    } catch (err) {
      console.error("submit review error", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.message || "Submit failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Review: {item?.name}</h2>

        <p className="text-sm text-gray-500 mb-4">Order: {orderid}</p>

        {/* Iron */}
        <div className="mb-4">
          <label className="font-semibold">Iron Rating (0-5)</label>
          <input type="number" min="0" max="5" value={ironRating} onChange={(e) => setironRating(e.target.value)} className="w-full p-2 border rounded mt-2" />
          <textarea placeholder="Iron review (optional)" value={ironText} onChange={(e) => setironText(e.target.value)} className="w-full p-2 border rounded mt-2" />
        </div>

        {/* Wash */}
        <div className="mb-4">
          <label className="font-semibold">Wash Rating (0-5)</label>
          <input type="number" min="0" max="5" value={washRating} onChange={(e) => setwashRating(e.target.value)} className="w-full p-2 border rounded mt-2" />
          <textarea placeholder="Wash review (optional)" value={washText} onChange={(e) => setwashText(e.target.value)} className="w-full p-2 border rounded mt-2" />
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
