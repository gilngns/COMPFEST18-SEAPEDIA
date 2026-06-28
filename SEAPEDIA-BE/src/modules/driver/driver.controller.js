const usecase = require("./driver.usecase");

async function getDashboard(req, res, next) {
  try {
    const data = await usecase.getDashboard(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getAvailableJobs(req, res, next) {
  try {
    const data = await usecase.getAvailableJobs();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getJobDetail(req, res, next) {
  try {
    const data = await usecase.getJobDetail(req.params.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getMyDeliveries(req, res, next) {
  try {
    const data = await usecase.getMyDeliveries(req.user.userId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function takeJob(req, res, next) {
  try {
    const data = await usecase.takeJob(req.user.userId, req.params.id);
    res.json({ message: "Pesanan berhasil diambil", data });
  } catch (err) {
    next(err);
  }
}

async function completeJob(req, res, next) {
  try {
    const data = await usecase.completeJob(req.user.userId, req.params.id);
    res.json({ message: "Pengiriman berhasil diselesaikan", data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getAvailableJobs,
  getJobDetail,
  getMyDeliveries,
  takeJob,
  completeJob
};
