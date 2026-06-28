const driverRepository = require("./driver.repository");

class DriverUseCase {
  async getDashboard(driverId) {
    return driverRepository.getDashboardStats(driverId);
  }

  async getAvailableJobs() {
    return driverRepository.getAvailableJobs();
  }

  async getJobDetail(orderId) {
    return driverRepository.getJobDetail(orderId);
  }

  async getMyDeliveries(driverId) {
    return driverRepository.getMyDeliveries(driverId);
  }

  async takeJob(driverId, orderId) {
    return driverRepository.takeJob(driverId, orderId);
  }

  async completeJob(driverId, orderId) {
    return driverRepository.completeJob(driverId, orderId);
  }
}

module.exports = new DriverUseCase();
