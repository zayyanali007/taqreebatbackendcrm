import mongoose from "mongoose";

const packagesSchema = new mongoose.Schema({
  videography: [String],
  photography: [String],
  deliverables: [String],
  name: { type: String, required: true },
  price: { type: Number, required: true },
  noOfPhotos: { type: Number, required: true },
  images: [String],
  description: { type: String, required: true },
});

const PhotoGrapherSchema = new mongoose.Schema({
  ownerinfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  package: [packagesSchema],
});

const PhotoGrapherModel = mongoose.model("photographers", PhotoGrapherSchema);

export default PhotoGrapherModel;
