import { createSlice } from "@reduxjs/toolkit";

const mapslice = createSlice({
  name: "Map",
  initialState: {
    location: { lat: null, lon: null },
    address: null,
  },
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, setLocation } = mapslice.actions;
export default mapslice.reducer;
