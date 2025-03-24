import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteReview, fetchRestaurant, sendReview } from "../api";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export default function RestaurantDetail() {
  const { restaurantId: id } = useParams();
  const [userReviews, setUserReviews] = useState([]);
  const token = useSelector((state) => state.user.token);
  const [userId, setUserId] = useState(null);
  const [submitReviewError, setSubmitReviewError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  const {
    data: restaurant,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["restaurantDetails", id],
    queryFn: () => fetchRestaurant(id),
  });

  useEffect(() => {
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserId(decoded.sub);
  }, [token]);

  useEffect(() => {
    if (restaurant) {
      setUserReviews(restaurant.partner_comments);
    }
  }, [restaurant]);

  const submitReview = async () => {
    if (!newReview.rating) {
      setSubmitReviewError("Rating cannot be empty.");
      return;
    }
    try {
      await sendReview({
        restaurant_id: id,
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
        restaurant_id: id,
      });
      setSubmitReviewError(null);
      refetch();
    } catch (e) {
      setSubmitReviewError("To submit review, you should login first.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={restaurant.restaurant.image_url}
        className="w-full h-64 object-cover mb-4 rounded"
      />
      <h1 className="text-2xl font-bold">{restaurant.restaurant.name}</h1>
      <p className="text-sm text-gray-600">
        {restaurant.restaurant.location?.address1}
      </p>

      <div className="mt-4">
        <h2 className="font-semibold mb-1">Yelp Rating</h2>
        <div className="mb-2 border-b pb-2 text-sm">
          ⭐ {restaurant.restaurant.rating}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-1">User Reviews</h2>
        {userReviews.map((r, i) => (
          <div
            key={i}
            className="mb-4 p-3 border border-gray-200 rounded-md shadow-sm bg-white"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-800">{r.username}</span>
              <span className="text-yellow-500 font-semibold">
                ⭐ {r.rating}/5
              </span>
              {r.user_id === userId && (
                <button
                  onClick={() => handleDeleteReview(r.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-700 text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
      {submitReviewError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{submitReviewError}</span>
        </div>
      )}
      <div className="mt-6 border-t pt-4">
        <h2 className="font-semibold mb-2">Leave a Review</h2>
        <input
          type="number"
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          placeholder="Rating (1-5)"
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Comment"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={submitReview}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
