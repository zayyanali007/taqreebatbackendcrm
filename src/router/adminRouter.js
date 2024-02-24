import express from "express";
import authHandler from "../middleware/authHandler.js";

import promiseHandler from "../middleware/promiseHandler.js";
import adminController from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.use(authHandler);

adminRouter.post(
  "/allVendors",
  promiseHandler(adminController.getAllPendingVendors)
);

adminRouter.get("/adminData", promiseHandler(adminController.getAdminData));
adminRouter.put(
  "/approveVendors",
  promiseHandler(adminController.approveVendors)
);
adminRouter.put("/makefeatured", promiseHandler(adminController.makeFeatured));

export default adminRouter;
