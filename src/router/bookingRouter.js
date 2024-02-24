import express from "express";
import authHandler from "../middleware/authHandler.js";

import promiseHandler from "../middleware/promiseHandler.js";
import BookingController from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.use(authHandler);

/* Get */
bookingRouter.post(
  "/getBooking",
  promiseHandler(BookingController.viewVendorsBooking)
);
bookingRouter.get(
  "/getStatusBooking",
  promiseHandler(BookingController.getBookingStatus)
);
bookingRouter.get(
  "/getcanceledBooking",
  promiseHandler(BookingController.getCanceledBooking)
);

/* Post */
bookingRouter.post(
  "/createBooking",
  promiseHandler(BookingController.addWalkInBooking)
);

bookingRouter.get(
  "/userBooking",
  promiseHandler(BookingController.viewUsersBooking)
);

bookingRouter.post(
  "/addPayment",
  promiseHandler(BookingController.addwalkInBookingPayment)
);

/* Put */
bookingRouter.put(
  "/updateBooking",
  promiseHandler(BookingController.updateWalkInVendorBooking)
);

bookingRouter.put(
  "/completeBooking",
  promiseHandler(BookingController.completedBooking)
);

bookingRouter.put(
  "/cancelBooking",
  promiseHandler(BookingController.canceledBooking)
);

export default bookingRouter;
