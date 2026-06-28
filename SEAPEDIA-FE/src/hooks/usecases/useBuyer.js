import { useState, useCallback } from "react";
import { buyerAPI } from "../../services/buyerService";

export function useBuyer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.getWallet();
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load wallet");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const topUpWallet = useCallback(async (amount) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.topUpWallet(amount);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to top up wallet");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWalletTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.getWalletTransactions();
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load wallet transactions");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.getAddresses();
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load addresses");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (addressData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.addAddress(addressData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add address");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.deleteAddress(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete address");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDefaultAddress = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buyerAPI.setDefaultAddress(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to set default address");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getWallet,
    topUpWallet,
    getWalletTransactions,
    getAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress
  };
}
