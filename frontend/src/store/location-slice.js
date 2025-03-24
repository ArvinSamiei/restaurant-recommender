import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    useGPS: true,
    location: undefined,
    latitude: undefined,
    longitude: undefined,
  },
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setLatLon(state, action) {
      let { latitude, longitude } = action.payload;
      state.latitude = latitude;
      state.longitude = longitude;
    },
    setUseGPS(state, action) {
      state.useGPS = action.payload;
    },
  },
});

export const { setLocation, setLatLon, setUseGPS } = locationSlice.actions;

export default locationSlice.reducer;
