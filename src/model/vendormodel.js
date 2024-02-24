import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  BussinessDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    default: null,
  },
  accepted: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  pending: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
