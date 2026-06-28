import { useState, useEffect, useCallback } from "react";
import { reviewAPI } from "../../services/reviewService";

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewAPI.getReviews();
      if (data?.data) {
        const backendReviews = data.data.map(r => ({
            name: r.name,
            role: "Pengguna Seapedia",
            avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(r.name) + "&background=006B7A&color=fff",
            text: r.comment,
            rating: r.rating || 5
        }));
        setReviews(backendReviews);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (reviewData) => {
    try {
      const res = await reviewAPI.createReview(reviewData);
      const newR = res.data;
      const formattedReview = {
        name: newR.name,
        role: "Pengguna Seapedia",
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(newR.name) + "&background=006B7A&color=fff",
        text: newR.comment,
        rating: newR.rating || 5
      };
      setReviews(prev => [formattedReview, ...prev]);
      return formattedReview;
    } catch (err) {
      throw err;
    }
  };

  return {
    reviews,
    isLoading,
    error,
    addReview,
    refresh: fetchReviews
  };
}
