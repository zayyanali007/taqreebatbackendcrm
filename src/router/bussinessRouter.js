import express from "express";
import authHandler from "../middleware/authHandler.js";
import BussinessController from "../controller/bussinessController.js";
import promiseHandler from "../middleware/promiseHandler.js";

const bussinessRouter = express.Router();
// bussinessRouter.use(authHandler);

bussinessRouter.post(
  "/addBussiness",
  authHandler,
  promiseHandler(BussinessController.addBussinessDetail)
);
bussinessRouter.put(
  "/updateBussiness",
  authHandler,
  promiseHandler(BussinessController.updateBussinessDetail)
);
bussinessRouter.get(
  "/getBussiness",
  authHandler,
  promiseHandler(BussinessController.getBussinessDetail)
);
bussinessRouter.get(
  "/getFeatured",
  promiseHandler(BussinessController.getFeatured)
);
bussinessRouter.get(
  "/getAllBussiness",
  promiseHandler(BussinessController.getAllBussinessDetail)
);
bussinessRouter.post(
  "/getBussiness/details",
  promiseHandler(BussinessController.getDetailOnVendorId)
);

bussinessRouter.delete(
  "/deleteBussiness",
  authHandler,
  promiseHandler(BussinessController.deleteBussinessDetail)
);

export default bussinessRouter;
