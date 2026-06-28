import { useState, useCallback } from "react";
import { driverAPI } from "../../services/driverService";

export function useDriver() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.getDashboard();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailableJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.getAvailableJobs();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getJobDetail = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.getJobDetail(orderId);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyDeliveries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.getMyDeliveries();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const takeJob = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.takeJob(orderId);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeJob = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await driverAPI.completeJob(orderId);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getDashboard,
    getAvailableJobs,
    getJobDetail,
    getMyDeliveries,
    takeJob,
    completeJob
  };
}
