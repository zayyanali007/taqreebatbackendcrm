import ReviewModel from "../model/reviewmodel.js";

const ReviewController = {
  getReviews: async (req, res) => {
    const { reviewId } = req.body;

    const reviews = await ReviewModel.findById(reviewId).populate({
      path: "reviews.userinfo",
      select: "-password",
    });

    if (reviews == null) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(200).json({ message: "success", reviews });
  },

  addReview: async (req, res, next) => {
    const userId = req.userId;
    const { reviewId, comment, rated } = req.body;

    var reviewed = { comment, userinfo: userId, rated: rated };
    await ReviewModel.findByIdAndUpdate(reviewId, {
      $push: { reviews: reviewed },
    });

    next();

    return res.status(201).json({ message: "success" });
  },

  editReview: async (req, res, next) => {
    const { reviewId, editreviewId, comment, rated } = req.body;

    await ReviewModel.updateOne(
      { _id: reviewId, "reviews._id": editreviewId },
      { $set: { "reviews.$.comment": comment, "reviews.$.rated": rated } }
    );
    next();
    return res.status(200).json({ message: "success" });
  },

  updateTotalRating: async (req, res) => {
    const { reviewId } = req.body;

    const findReview = await ReviewModel.findById(reviewId);
    const totalRating =
      findReview.reviews.reduce((total, review) => total + review.rated, 0) /
      findReview.reviews.length;
    await ReviewModel.findByIdAndUpdate(reviewId, {
      totalRating: totalRating,
    });
  },
};

export default ReviewController;
