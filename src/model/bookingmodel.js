import mongoose from "mongoose";

const bookingModelSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  personCount: {
    type: Number,
    default: null,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  customerName: {
    type: String,
    required: false,
  },
  customerContactNo: {
    type: String,
    required: true,
  },

  typeofEvent: {
    type: String,
    required: true,
  },
  paymentInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  isWalkInCustomer: {
    type: Boolean,
    default: true,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  details: { type: Object, default: null },
});

const BookingModel = mongoose.model("Bookings", bookingModelSchema);

export default BookingModel;
