import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
  },
  reducers: {
    setUser(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
