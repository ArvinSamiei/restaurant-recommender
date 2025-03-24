import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./restaurant-slice";
import locationReducer from "./location-slice";
import userReducer from "./user-slice";

export const store = configureStore({
  reducer: {
    restaurants: restaurantReducer,
    location: locationReducer,
    user: userReducer,
  },
});
