import axios from "axios";
import { useEffect } from "react";
import { serverurl } from "../../App.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/Userslice.js";

const UseGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const result = await axios.get(`${serverurl}/auth/getcurrent`, {
          withCredentials: true,
        });

        const payload = result?.data?.user || result?.data || null;
        dispatch(setUserData(payload));
      } catch (error) {
        dispatch(setUserData(null));
        console.log(error?.response?.data || error.message);
      }
    };

    fetchuser();
  }, [dispatch]);
};

export default UseGetCurrentUser;
