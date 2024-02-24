import express from "express";
import authHandler from "../middleware/authHandler.js";
import venueController from "../controller/venueController.js";
// import venueBookingController from "../controller/venueBookingController.js";
import promiseHandler from "../middleware/promiseHandler.js";

const venueRouter = express.Router();

venueRouter.use(authHandler);

venueRouter.post("/addVenue", promiseHandler(venueController.addVenue));
venueRouter.get("/getvenue", promiseHandler(venueController.getVenue));
venueRouter.put("/updatevenue", promiseHandler(venueController.updateVenue));

//Booking

// /* Get */
// venueRouter.get(
//   "/getVenueBooking",
//   promiseHandler(venueBookingController.getVenueBookingDetail)
// );
// venueRouter.get(
//   "/cancelVenueBooking",
//   promiseHandler(venueBookingController.getCanceledBooking)
// );

// /* Post */
// venueRouter.post(
//   "/createVenueBooking",
//   promiseHandler(venueBookingController.addVenueWalkInBookingDetail)
// );

// /* Put */
// venueRouter.put(
//   "/updateVenueBooking",
//   promiseHandler(venueBookingController.updateVenueWalkInBooking)
// );

// venueRouter.put(
//   "/completeVenueBooking",
//   promiseHandler(venueBookingController.completedBooking)
// );

// venueRouter.put(
//   "/cancelVenueBooking",
//   promiseHandler(venueBookingController.canceledBooking)
// );

export default venueRouter;
