import React from "react";
import { useSelector } from "react-redux";
import { RestaurantItem } from "./RestaurantItem";

const RestaurantList = () => {
  const restaurants = useSelector((state) => state.restaurants.restaurants);

  if (!restaurants.length) {
    return <p className="text-center text-gray-500">No restaurants found.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 px-4">
      {restaurants.map((r) => (
        <RestaurantItem key={r.id} restaurant={r} />
      ))}
    </div>
  );
};

export default RestaurantList;
