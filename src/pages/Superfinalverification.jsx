 
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App";

 export function SuperFinalVerification({ email, onSuccess, onCancel }) {
  const [form, setform] = useState({
    mobile: "",
    home:"",
    name: "",
    realname: "",
   
    officename: "",
    sonname: "",
    daughter: "",
    wifename: "",
    mobilename: "",
    earning: "",
    collegename: "",
   
  });

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const submitfinal = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    setsuccess("");

    try {
      const res = await axios.post(
        `${serverurl}/auth/suppfulll`,
        { email, ...form },
        { withCredentials: true }
      );

      if (res?.data?.success) {
        setsuccess("Super Admin Full Verification Completed ✔");
        setTimeout(() => onSuccess?.(), 800);
      } else {
        seterror(res?.data?.message || "Verification failed");
      }
    } catch (err) {
      console.log(err?.response?.message || "Server error");
      
      console.log(err?.response?.data|| "Server error");
    } finally {
      setloading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">

        <h3 className="text-2xl font-semibold text-emerald-700 mb-3">
          Final Super Admin Verification
        </h3>

        {error && <div className="text-sm text-rose-600 mb-2">{error}</div>}
        {success && <div className="text-sm text-emerald-600 mb-2">{success}</div>}

        <form onSubmit={submitfinal} className="grid grid-cols-1 gap-3">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handlechange}
              placeholder={key.toUpperCase()}
              className="w-full rounded-lg p-3 border border-emerald-200 bg-emerald-50"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl mt-2"
          >
            {loading ? "Verifying..." : "Complete Final Verification"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-center text-rose-600 underline mt-3"
          >
            Cancel
          </button>
        </form>
      </div>
    </motion.div>
  );
}
