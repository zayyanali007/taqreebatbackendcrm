import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  personCount: {
    type: Number,
    default: null,
  },
  typeofEvent: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  bookingDetail: {
    type: Object,
    required: true,
  },
  // quotedDetail: {
  //   type: Object,
  //   default: {},
  // },
  vendorConfirmation: {
    type: Number,
    default: 0,
  },
  userConfirmation: {
    type: Number,
    default: 0,
  },
});

const RequestsModel = mongoose.model("requests", requestSchema);

export default RequestsModel;
