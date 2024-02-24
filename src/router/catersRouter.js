import express from "express";
import authHandler from "../middleware/authHandler.js";
import CatersController from "../controller/catersController.js";
import promiseHandler from "../middleware/promiseHandler.js";

const catersRouter = express.Router();

catersRouter.use(authHandler);

// Menu Items
catersRouter.get(
  "/getAllMenuItem",
  promiseHandler(CatersController.getAllMenuItems)
);
catersRouter.post("/addMenuItem", promiseHandler(CatersController.addFoodMenu));
catersRouter.put(
  "/updateMenuItem",
  promiseHandler(CatersController.editMenuItem)
);
catersRouter.delete(
  "/deleteMenuItem",
  promiseHandler(CatersController.deleteMenuItem)
);

// Packages
catersRouter.get(
  "/getAllPackages",
  promiseHandler(CatersController.getAllPackages)
);
catersRouter.post("/addPackage", promiseHandler(CatersController.addPackage));
catersRouter.put(
  "/updatePackage",
  promiseHandler(CatersController.editpackage)
);
catersRouter.delete(
  "/deletePackage",
  promiseHandler(CatersController.deletePackage)
);

export default catersRouter;
