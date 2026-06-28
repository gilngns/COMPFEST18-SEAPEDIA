import { useState, useCallback } from "react";
import { sellerAPI } from "../../services/sellerService";

export function useSeller() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const upsertStore = useCallback(async (data, config) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.upsertStore(data, config);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update store");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyStore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.getMyStore();
      return res?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load store");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPublicStore = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.getPublicStore(id);
      return res?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load store");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data, config) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.createProduct(data, config);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create product");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listMyProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.listMyProducts();
      return res?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load products");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, data, config) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.updateProduct(id, data, config);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update product");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.deleteProduct(id);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete product");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.getWallet();
      return res?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load wallet");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWalletTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.getWalletTransactions();
      return res?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load wallet transactions");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const withdrawFunds = useCallback(async (amount) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sellerAPI.withdrawFunds(amount);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to withdraw funds");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    upsertStore,
    getMyStore,
    getPublicStore,
    createProduct,
    listMyProducts,
    updateProduct,
    deleteProduct,
    getWallet,
    getWalletTransactions,
    withdrawFunds
  };
}
