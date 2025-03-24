import { useDispatch, useSelector } from "react-redux";
import { setLatLon, setLocation, setUseGPS } from "../store/location-slice";
import { setParams, setRestaurants } from "../store/restaurant-slice";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RestaurantList from "./RestaurantList";
import { fetchRestaurants } from "../api";

export const Home = () => {
  const [term, setTerm] = useState("");
  const [price, setPrice] = useState("");
  const [inputLocation, setInputLocation] = useState("");
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location);
  const searchParams = useSelector((state) => state.restaurants.searchParams);
  const restaurants = useSelector((state) => state.restaurants.restaurants);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["restaurants", searchParams, locations],
    queryFn: () =>
      fetchRestaurants({
        term: searchParams.term,
        price: searchParams.price,
        latitude: locations.useGPS ? locations.latitude : undefined,
        longitude: locations.useGPS ? locations.longitude : undefined,
        location: !locations.useGPS ? locations.location : undefined,
      }),
    enabled:
      (locations.useGPS && !!locations.latitude && !!locations.longitude) ||
      (!locations.useGPS && !!locations.location),
  });

  useEffect(() => {
    if (locations.useGPS) getLocation();
  }, [locations]);

  useEffect(() => {
    dispatch(setLocation(undefined));
    return () => {
      dispatch(setLocation(undefined));
    };
  }, []);

  useEffect(() => {
    dispatch(setRestaurants(data));
  }, [data]);

  const getLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          setLatLon({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      },
      (err) => {
        console.warn("GPS failed, switching to manual location");
        dispatch(setUseGPS(false));
      }
    );
  };

  const handleSearch = () => {
    if (locations.useGPS) {
      // refresh GPS before search
      getLocation();
    }

    dispatch(setParams({ term, price }));

    dispatch(setLocation(inputLocation));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🍽️ Bain Partner Restaurant Recommender
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Cuisine (e.g. sushi)"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="flex-1 border px-4 py-2 rounded"
        />

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Prices</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
        </select>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={locations.useGPS}
            onChange={(e) => dispatch(setUseGPS(e.target.checked))}
          />
          Use my current location (GPS)
        </label>

        {!locations.useGPS && (
          <input
            type="text"
            placeholder="Enter city (e.g. Toronto)"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        )}

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {isLoading && <p className="text-center">Loading restaurants...</p>}
      {error && (
        <p className="text-center text-red-500">Failed to fetch restaurants.</p>
      )}

      {!isLoading && restaurants && <RestaurantList />}
    </div>
  );
};
