import React, { useState, useRef, Children, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants } from "./api";
import RestaurantList from "./components/RestaurantList";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurants, setParams } from "./store/restaurant-slice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home";

import "./App.css";
import RestaurantDetail from "./components/RestaurantDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import { RootElement } from "./components/RootElement";
import { setUser } from "./store/user-slice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootElement />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/restaurant/:restaurantId", element: <RestaurantDetail /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

function App() {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    dispatch(setUser(localStorageToken));
  }, [token]);

  return <RouterProvider router={router} />;
}

export default App;
