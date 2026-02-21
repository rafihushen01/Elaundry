import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/Userslice.js";
import { setAddress, setLocation } from "../redux/Mapslice.js";


const useGetCurrentCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCity = async (latitude, longitude) => {
      try {
        const apikey = import.meta.env.VITE_GEO_API;
        if (!apikey) {
          console.error("⚠️ Missing Geo API key in .env file");
          return;
        }

        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`;
        const { data } = await axios.get(url);
        const info = data?.results?.[0];

        if (!info) {
          console.warn("⚠️ No location data found from Geoapify API");
          return;
        }
        console.log(info)

        const city = info.city || info.county || info.state || "Unknown";
        const address = info.formatted || "Address not found";
        const state = info.state || "N/A";
          

        dispatch(setCurrentCity(city));
        dispatch(setCurrentAddress(address));
        dispatch(setCurrentState(state));
        dispatch(setLocation({ lat: latitude, lon: longitude }));
        dispatch(setAddress(info?.address_line1 || address_line2));
        console.log(city,state,address)

      } catch (error) {
        console.error("❌ Error fetching city:", error.message);
      }
    };

    // ✅ get user geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
  ;
          getCity(latitude, longitude);
        },
        (err) => {
          console.error("🚫 Location access denied:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("⚠️ Geolocation not supported in this browser");
    }
  }, [dispatch]);
};

export default useGetCurrentCity;
