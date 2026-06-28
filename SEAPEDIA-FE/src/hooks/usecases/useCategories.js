import { useState, useEffect, useCallback } from "react";
import { categoryAPI } from "../../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryAPI.getCategories();
      if (data?.success) {
        setCategories(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories
  };
}
