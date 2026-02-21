import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",

  initialState: {
    userData: null,
    currentcity: null,
    currentstate: null,
    currentaddress: null,
    currentcartiems: [],
    location: [0, 0],
    totalamount: 0,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setCurrentCity: (state, action) => {
      state.currentcity = action.payload;
    },

    setCurrentState: (state, action) => {
      state.currentstate = action.payload;
    },

    setCurrentAddress: (state, action) => {
      state.currentaddress = action.payload;
    },

    setCurrentCartItems: (state, action) => {
      state.currentcartiems = action.payload;
    },

    setLocation: (state, action) => {
      state.location = action.payload;
    },

    setTotalAmount: (state, action) => {
      state.totalamount = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setCurrentCartItems,
  setLocation,
  setTotalAmount,
} = userslice.actions;

export default userslice.reducer;
