import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    userinfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rated: { type: Number, required: true },
  },
  { timestamps: true }
);

const reviewsSchema = new mongoose.Schema({
  totalRating: { type: Number, default: 0 },
  reviews: [reviewSchema],
});

const ReviewModel = mongoose.model("Reviews", reviewsSchema);

export default ReviewModel;
