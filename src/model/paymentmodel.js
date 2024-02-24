import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  amountPending: {
    type: Number,
    required: true,
    default: function () {
      return this.totalAmount;
    },
  },

  amountPaid: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentStatus: {
    type: String,
    required: true,
    default: "pending",
  },
});

const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;
