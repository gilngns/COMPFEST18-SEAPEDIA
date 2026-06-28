import { useState, useEffect, useCallback } from "react";
import { catalogService } from "../../services/catalogService";

export function useCatalog(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await catalogService.getProducts(params);
      const productList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setProducts(productList);
      setTotalPages(res?.totalPages || 1);
      setTotalItems(res?.totalItems || 0);
    } catch (err) {
      setError(err);
      console.error("Gagal memuat produk:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProductDetail = useCallback(async (id) => {
    return await catalogService.getProductById(id);
  }, []);

  useEffect(() => {
    fetchProducts(initialParams);
  }, [fetchProducts, JSON.stringify(initialParams)]);

  return {
    products,
    totalPages,
    totalItems,
    isLoading,
    error,
    refetch: fetchProducts,
    getProductDetail
  };
}
