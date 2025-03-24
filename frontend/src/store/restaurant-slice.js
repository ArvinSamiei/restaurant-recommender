import { createSlice } from "@reduxjs/toolkit";

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: {
    restaurants: [],
    searchParams: { term: "", price: "" },
  },
  reducers: {
    setRestaurants(state, action) {
      state.restaurants = action.payload;
    },
    setParams(state, action) {
      state.searchParams = action.payload;
    },
  },
});

export const { setRestaurants, setParams } = restaurantSlice.actions;

export default restaurantSlice.reducer;
