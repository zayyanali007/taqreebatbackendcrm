import express from "express";
import authHandler from "../middleware/authHandler.js";
import ReviewController from "../controller/reviewRatingController.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/addReview",
  authHandler,
  ReviewController.addReview,
  ReviewController.updateTotalRating
);

reviewRouter.post(
  "/editReview",
  ReviewController.editReview,
  ReviewController.updateTotalRating
);

reviewRouter.post("/getReviews", ReviewController.getReviews);

export default reviewRouter;
