import express from "express";
import authHandler from "../middleware/authHandler.js";
import promiseHandler from "../middleware/promiseHandler.js";
import photographerControllers from "../controller/photographerController.js";

const photographersRouter = express.Router();

photographersRouter.use(authHandler);

// Packages
photographersRouter.get(
  "/photographer/getAllPackages",
  promiseHandler(photographerControllers.getAllPackages)
);
photographersRouter.post(
  "/photographer/addPackage",
  promiseHandler(photographerControllers.addPackage)
);
photographersRouter.put(
  "/photographer/updatePackage",
  promiseHandler(photographerControllers.editpackage)
);
photographersRouter.delete(
  "/photographer/deletePackage",
  promiseHandler(photographerControllers.deletePackage)
);

export default photographersRouter;
