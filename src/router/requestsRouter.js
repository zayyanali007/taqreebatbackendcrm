import express from "express";
import authHandler from "../middleware/authHandler.js";

import promiseHandler from "../middleware/promiseHandler.js";
import requestsController from "../controller/requestsController.js";

const requestsRouter = express.Router();

requestsRouter.post(
  "/addrequest",
  authHandler,
  promiseHandler(requestsController.addRequest)
);

requestsRouter.get(
  "/getVendorRequests",
  authHandler,
  promiseHandler(requestsController.getVendorsRequest)
);

requestsRouter.get(
  "/getUserRequests",
  authHandler,
  promiseHandler(requestsController.getUsersRequest)
);

// requestsRouter.put("/quoteRequest", requestsController.quoteRequest);

requestsRouter.put(
  "/confirmRequest",
  authHandler,
  promiseHandler(requestsController.confirmRequest)
);

export default requestsRouter;
