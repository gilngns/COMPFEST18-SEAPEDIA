const AppError = require("../../utils/AppError");
const driverRepository = require("./driver.repository");

const getDashboard = async (driverId) => {
    return driverRepository.getDashboardStats(driverId);
  }
const getAvailableJobs = async () => {
    return driverRepository.getAvailableJobs();
  }
const getJobDetail = async (orderId) => {
    return driverRepository.getJobDetail(orderId);
  }
const getMyDeliveries = async (driverId) => {
    return driverRepository.getMyDeliveries(driverId);
  }
const takeJob = async (driverId, orderId) => {
    return driverRepository.takeJob(driverId, orderId);
  }
const completeJob = async (driverId, orderId) => {
    return driverRepository.completeJob(driverId, orderId);
  }

module.exports = { getDashboard, getAvailableJobs, getJobDetail, getMyDeliveries, takeJob, completeJob };

