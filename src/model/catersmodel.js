import mongoose from "mongoose";

const foodMenuSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  images: [String],
});

const packagesSchema = new mongoose.Schema({
  details: [String],
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  type: { type: String, required: true },
  description: { type: String, required: true },
});

const catersSchema = new mongoose.Schema({
  ownerinfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  FoodMenu: [foodMenuSchema],
  package: [packagesSchema],
});

const CatersModel = mongoose.model("Caters", catersSchema);

export default CatersModel;
