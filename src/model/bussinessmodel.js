import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  BussinessName: { type: String, required: true },
  coverPhotos: [String],
  ContactNo: { type: String, required: true },
  email: { type: String, required: true },
  bnlogo: { type: String, required: true },
  city: { type: String, required: true },
  Address: { type: String, required: true },
  bnType: { type: String, required: true },
  website: { type: String, default: null },
  peopleViewed: { type: Number, default: 0 },
  ratingInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reviews",
    required: true,
  },
});

const BusinessModel = mongoose.model("Business", businessSchema);

export default BusinessModel;
