// OwnerOrder.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App.jsx";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaTruck,
  FaCheck,
  FaExclamationTriangle,
  FaFileCsv,
} from "react-icons/fa";

/**
 * Ultimate Owner Orders page
 * - fetches /order/all
 * - allows status updates via /order/status
 * - search, filter, pagination, bulk actions, CSV export
 *
 * NOTE: keep variable names lowercase, hooks useEffect/useState correct
 */

const STATUSES = ["pending", "processing", "onway", "completed", "cancelled"];

const OwnerOrder = () => {
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);
  const [query, setquery] = useState("");
  const [statusFilter, setstatusFilter] = useState("all");
  const [page, setpage] = useState(1);
  const [perPage, setperPage] = useState(8);
  const [selected, setselected] = useState(new Set());
  const [detailOrder, setdetailOrder] = useState(null);
  const [updating, setupdating] = useState(false);
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const mountedRef = useRef(true);

  // fetch orders
  const fetchorders = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${serverurl}/order/all`, {
        withCredentials: true,
      });
      const data = res.data?.data || [];
      setorders(data);
    } catch (err) {
      console.error("fetchorders err", err?.response?.data || err?.message);
      toast.error("Failed to load orders");
    } finally {
      if (mountedRef.current) setloading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchorders();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // search + filter + date range + pagination
  const filtered = useMemo(() => {
    let list = orders.slice();

    // status filter
    if (statusFilter !== "all") {
      list = list.filter((o) => (o.status || "").toLowerCase() === statusFilter);
    }

    // query search: id, user mobile, shop name, address
    if (query && query.trim() !== "") {
      const q = query.trim().toLowerCase();
      list = list.filter((o) => {
        const user = (o.userid?.username || "") + " " + (o.userid?.email || "") + " " + (o.userid?.mobile || "");
        const shop = (o.shopid?.name || "") + " " + (o.shopid?.branch || "");
        const addr = o.deliveryaddress || "";
        return (
          (o._id || "").toLowerCase().includes(q) ||
          user.toLowerCase().includes(q) ||
          shop.toLowerCase().includes(q) ||
          addr.toLowerCase().includes(q)
        );
      });
    }

    // date range filter (createdAt)
    if (dateFrom) {
      const df = new Date(dateFrom);
      list = list.filter((o) => new Date(o.createdAt) >= df);
    }
    if (dateTo) {
      // include entire day for dateTo
      const dt = new Date(dateTo);
      dt.setHours(23, 59, 59, 999);
      list = list.filter((o) => new Date(o.createdAt) <= dt);
    }

    // sort by newest
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [orders, statusFilter, query, dateFrom, dateTo]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // optimistic status update for single order
  const changeOrderStatus = async (orderid, newstatus) => {
    if (!orderid || !newstatus) return;
    if (!STATUSES.includes(newstatus)) {
      toast.error("Invalid status");
      return;
    }

    const proceed = confirm(`Change order ${orderid} -> ${newstatus.toUpperCase()} ?`);
    if (!proceed) return;

    try {
      setupdating(true);
      // optimistic UI
      const backup = orders.map((o) => ({ ...o }));
      setorders((prev) => prev.map((o) => (o._id === orderid ? { ...o, status: newstatus } : o)));

      const res = await axios.put(
        `${serverurl}/order/status`,
        { orderid, status: newstatus },
        { withCredentials: true }
      );

      if (res?.data?.data) {
        // replace with server response for consistency
        setorders((prev) => prev.map((o) => (o._id === orderid ? res.data.data : o)));
        toast.success("Status updated");
      } else {
        // fallback: re-fetch
        await fetchorders();
      }
    } catch (err) {
      console.error("changeOrderStatus err", err?.response?.data || err?.message);
      toast.error("Status update failed — reverting");
      // revert optimistic
      await fetchorders();
    } finally {
      setupdating(false);
    }
  };

  // bulk update selected orders
  const bulkUpdateStatus = async (newstatus) => {
    if (selected.size === 0) {
      toast("Select orders first");
      return;
    }
    if (!STATUSES.includes(newstatus)) {
      toast.error("Invalid status");
      return;
    }
    const proceed = confirm(`Change ${selected.size} orders -> ${newstatus.toUpperCase()} ?`);
    if (!proceed) return;

    const ids = Array.from(selected);
    try {
      setupdating(true);
      // optimistic UI
      setorders((prev) => prev.map((o) => (ids.includes(o._id) ? { ...o, status: newstatus } : o)));

      // call sequentially (or you can batch on server if available)
      await Promise.all(
        ids.map((id) =>
          axios.put(`${serverurl}/order/status`, { orderid: id, status: newstatus }, { withCredentials: true })
        )
      );
      toast.success("Bulk update completed");
      setselected(new Set());
      await fetchorders();
    } catch (err) {
      console.error("bulkUpdateStatus err", err?.response?.data || err?.message);
      toast.error("Bulk update failed — reloading");
      await fetchorders();
    } finally {
      setupdating(false);
    }
  };

  // toggle select
  const toggleselect = (id) => {
    setselected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // export CSV of selected or all filtered
  const exportCsv = (useSelected = false) => {
    const items = useSelected ? orders.filter((o) => selected.has(o._id)) : filtered;
    if (items.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const rows = [
      ["order_id", "user", "shop", "status", "totalprice", "delivery_address", "mobile", "createdAt"],
    ];

    items.forEach((o) => {
      rows.push([
        o._id,
        `${o.userid?.username || ""} (${o.userid?.mobile || ""})`,
        `${o.shopid?.name || ""} - ${o.shopid?.branch || ""}`,
        o.status,
        o.totalprice,
        `"${(o.deliveryaddress || "").replace(/"/g, '""')}"`,
        o.delmobile || "",
        new Date(o.createdAt).toLocaleString(),
      ]);
    });

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-green-600 mb-4"
      >
        Owner — All Orders
      </motion.h2>

      {/* controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="flex items-center bg-white rounded-xl p-2 border shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            value={query}
            onChange={(e) => {
              setquery(e.target.value);
              setpage(1);
            }}
            placeholder="Search by order id, user, shop, address..."
            className="outline-none px-2 text-sm w-72"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setstatusFilter(e.target.value);
              setpage(1);
            }}
            className="rounded-lg p-2 border bg-white text-sm"
          >
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setdateFrom(e.target.value);
              setpage(1);
            }}
            className="rounded-lg p-2 border bg-white text-sm"
          />
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setdateTo(e.target.value);
              setpage(1);
            }}
            className="rounded-lg p-2 border bg-white text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => exportCsv(false)}
            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-green-50"
          >
            <FaFileCsv /> Export All
          </button>

          <button
            onClick={() => exportCsv(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-green-50"
          >
            <FaFileCsv /> Export Selected
          </button>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => bulkUpdateStatus("processing")}
              disabled={updating}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Bulk → Processing
            </button>
            <button
              onClick={() => bulkUpdateStatus("completed")}
              disabled={updating}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Bulk → Completed
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="space-y-4">
        {loading ? (
          <div className="w-full flex justify-center py-16">
            <div className="animate-spin w-12 h-12 border-t-4 border-green-500 rounded-full" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No orders match your filters.</div>
        ) : (
          paginated.map((o) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-4 border shadow-sm flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex items-start md:items-center gap-3 w-full md:w-1/12">
                <input
                  checked={selected.has(o._id)}
                  onChange={() => toggleselect(o._id)}
                  type="checkbox"
                  className="w-4 h-4"
                />
                <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex-1 w-full md:w-6/12">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Order <span className="text-green-600">{o._id}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      User: {o.userid?.username || "—"} • {o.userid?.mobile || "—"}
                     <span>{o.userid?.delmobile}  </span> 


                    </div>
                       
                    
                    
                    
                    
                    
                    
                    
                    
                                        <div className="text-xs text-gray-500 mt-1">
                      Shop: {o.shopid?.name || "—"} ({o.shopid?.branch || "—"})
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Delivery: {o.deliveryaddress || "—"} • {o.delmobile || "—"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        o.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : o.status === "processing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : o.status === "onway"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : o.status === "completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {o.status?.toUpperCase() || "—"}
                    </div>

                    {/* status dropdown */}
                    <select
                      value={o.status}
                      onChange={(e) => changeOrderStatus(o._id, e.target.value)}
                      className="rounded-lg p-2 border text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option value={s} key={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setdetailOrder(o)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* items preview */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {o.items?.slice(0, 4).map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={it.itemid?.image}
                        alt={it.itemid?.name}
                        className="w-10 h-10 rounded-md object-cover border"
                      />
                      <div>
                        <div className="font-semibold text-sm">{it.itemid?.name}</div>
                        <div className="text-xs">
                          iron: {it.services?.iron?.quantity || 0} | wash: {it.services?.wash?.quantity || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-3/12 flex flex-col items-end gap-2">
                <div className="text-sm font-semibold text-green-600">৳{o.totalprice || o.total}</div>
                <div className="text-xs text-gray-500">Payment: {o.paymentmethod || "—"}</div>
                <div className="text-xs text-gray-500">Items: {o.items?.length || 0}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(o._id);
                      toast.success("Order id copied");
                    }}
                    className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-green-50"
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {Math.min(filtered.length, (page - 1) * perPage + 1)} -{" "}
          {Math.min(filtered.length, page * perPage)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setpage((p) => Math.max(1, p - 1))}
            className="p-2 bg-white border rounded-lg"
            disabled={page === 1}
          >
            <FaChevronLeft />
          </button>

          <div className="px-3 py-2 border rounded-lg bg-white text-sm">{page}</div>

          <button
            onClick={() => setpage((p) => Math.min(totalPages, p + 1))}
            className="p-2 bg-white border rounded-lg"
            disabled={page === totalPages}
          >
            <FaChevronRight />
          </button>

          <select
            value={perPage}
            onChange={(e) => {
              setperPage(Number(e.target.value));
              setpage(1);
            }}
            className="ml-3 p-2 border rounded-lg bg-white text-sm"
          >
            {[6, 8, 12, 20].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* order detail modal / panel */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setdetailOrder(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-4xl rounded-2xl p-6 z-10 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Order {detailOrder._id}</h3>
                <div className="text-sm text-gray-500">Placed: {new Date(detailOrder.createdAt).toLocaleString()}</div>
                <div className="text-sm text-gray-500">User: {detailOrder.userid?.username || "—"}</div>
                <div className="text-sm text-gray-500">Shop: {detailOrder.shopid?.name || "—"}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-green-600">৳{detailOrder.totalprice || detailOrder.total}</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    detailOrder.status === "pending"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : detailOrder.status === "processing"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : detailOrder.status === "onway"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : detailOrder.status === "completed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {detailOrder.status?.toUpperCase()}
                </div>

                <button onClick={() => setdetailOrder(null)} className="px-3 py-2 bg-white border rounded-lg">
                  Close
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-700 mb-2">Items</p>
                <div className="space-y-3">
                  {detailOrder.items?.map((it, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg border bg-gray-50">
                      <img src={it.itemid?.image} className="w-16 h-16 rounded-md object-cover" />
                      <div>
                        <div className="font-semibold">{it.itemid?.name}</div>
                        <div className="text-xs text-gray-500">
                          iron: {it.services?.iron?.quantity || 0} | wash: {it.services?.wash?.quantity || 0}
                        </div>
                        <div className="text-sm text-green-600 font-semibold">
                          ৳{it.totalprice ?? it.services?.iron?.price + it.services?.wash?.washingprice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Delivery & Timeline</p>
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-green-600" />
                    <div>
                      <div className="font-semibold">{detailOrder.deliveryaddress}</div>
                      <div className="text-xs text-gray-500">Mobile: {detailOrder.delmobile}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Timeline</p>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center text-xs">
                        <FaClock className="text-yellow-500" />
                        <div>Pending</div>
                      </div>
                      <div className="flex-1 h-1 bg-gray-200" />
                      <div className="flex flex-col items-center text-xs">
                        <FaTruck className="text-blue-500" />
                        <div>Processing</div>
                      </div>
                      <div className="flex-1 h-1 bg-gray-200" />
                      <div className="flex flex-col items-center text-xs">
                        <FaTruck className="text-purple-500" />
                        <div>On Way</div>
                      </div>
                      <div className="flex-1 h-1 bg-gray-200" />
                      <div className="flex flex-col items-center text-xs">
                        <FaCheck className="text-green-500" />
                        <div>Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* map preview (if address contains coordinates or google maps link) */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Map Preview</p>
                    {detailOrder.deliverylocation?.lat ? (
                      <div className="w-full h-40 border rounded-md overflow-hidden">
                        <iframe
                          title="map"
                          src={`https://www.google.com/maps?q=${detailOrder.deliverylocation.lat},${detailOrder.deliverylocation.lon}&z=15&output=embed`}
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No coordinates available for this address.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <select
                value={detailOrder.status}
                onChange={async (e) => {
                  const newstatus = e.target.value;
                  // call update
                  await changeOrderStatus(detailOrder._id, newstatus);
                  // refresh detail from state
                  const updated = orders.find((x) => x._id === detailOrder._id) || detailOrder;
                  setdetailOrder({ ...detailOrder, status: updated.status || newstatus });
                }}
                className="rounded-lg p-2 border"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OwnerOrder;
