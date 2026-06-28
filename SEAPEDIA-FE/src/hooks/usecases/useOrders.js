import { useState, useCallback } from "react";
import { ordersAPI } from "../../services/ordersService";

export function useOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const previewCheckout = useCallback(async (discountCode = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.previewCheckout(discountCode);
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to preview checkout");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkout = useCallback(async (checkoutData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.checkout(checkoutData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Checkout failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.getMyOrders();
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load orders");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStoreOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.getStoreOrders();
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load store orders");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.updateOrderStatus(id, status);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update order status");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitReviews = useCallback(async (orderId, reviews) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersAPI.submitReviews(orderId, reviews);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit reviews");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    previewCheckout,
    checkout,
    getMyOrders,
    getStoreOrders,
    updateOrderStatus,
    submitReviews
  };
}
