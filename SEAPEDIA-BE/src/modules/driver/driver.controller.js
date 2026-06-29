const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./driver.usecase");

const getDashboard = catchAsync(async (req, res, next) => {
    const data = await usecase.getDashboard(req.user.userId);
    res.json({ data });
  });

const getAvailableJobs = catchAsync(async (req, res, next) => {
    const data = await usecase.getAvailableJobs();
    res.json({ data });
  });

const getJobDetail = catchAsync(async (req, res, next) => {
    const data = await usecase.getJobDetail(req.params.id);
    res.json({ data });
  });

const getMyDeliveries = catchAsync(async (req, res, next) => {
    const data = await usecase.getMyDeliveries(req.user.userId);
    res.json({ data });
  });

const takeJob = catchAsync(async (req, res, next) => {
    const data = await usecase.takeJob(req.user.userId, req.params.id);
    res.json({ message: "Pesanan berhasil diambil", data });
  });

const completeJob = catchAsync(async (req, res, next) => {
    const data = await usecase.completeJob(req.user.userId, req.params.id);
    res.json({ message: "Pengiriman berhasil diselesaikan", data });
  });

module.exports = {
  getDashboard,
  getAvailableJobs,
  getJobDetail,
  getMyDeliveries,
  takeJob,
  completeJob
};
