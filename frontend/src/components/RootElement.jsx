import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export const RootElement = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
