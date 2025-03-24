import { Link } from "react-router-dom";

export const RestaurantItem = ({ restaurant }) => {
  return (
    <div
      key={restaurant.id}
      className="min-w-[300px] max-w-[300px] flex-shrink-0 border rounded shadow-sm snap-start p-4 bg-white hover:bg-gray-50"
    >
      {restaurant.image_url && (
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h2 className="text-lg font-semibold mb-1">{restaurant.name}</h2>

      <div className="text-sm mb-2 space-y-1">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Yelp Rating:</span>
          <span className="text-yellow-500">{restaurant.rating}⭐</span>
        </div>
        {restaurant.partner_score !== undefined && (
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Partner Rating:</span>
            <span className="text-green-600">{restaurant.partner_score}⭐</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm">{restaurant.location?.address1}</p>

      <p className="text-xs text-gray-500 mt-2">
        {restaurant.categories.map((c) => c.title).join(", ")}
      </p>

      <Link
        to={`/restaurant/${restaurant.id}`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm text-center"
      >
        View Details
      </Link>
    </div>
  );
};
