import mongoose from "mongoose";

const VendorPassRecoverySchema = new mongoose.Schema({
  email: { type: String, required: true },
  createdAt: { type: Date },
  expiredAt: { type: Date },
});

const VendorPassRecoveryModel = mongoose.model(
  "VendorPassRecovery",
  VendorPassRecoverySchema
);

export default VendorPassRecoveryModel;
