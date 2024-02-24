import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  ownerinfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  venueName: {
    type: String,
    required: true,
  },
  venueCapacity: {
    type: Number,
    required: true,
  },
  venueStaff: {
    type: String,
    required: true,
  },
  venueParkingAvaliable: {
    type: String,
    required: true,
  },
  venueType: {
    type: String,
    required: true,
  },
  venuePrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  unit: { type: String, required: true },
  venueTimeSlot: {
    type: String,
    required: true,
  },
  venueImages: [String],
  venueFacility: [String],
});

const venueModel = mongoose.model("venues", venueSchema);

export default venueModel;
