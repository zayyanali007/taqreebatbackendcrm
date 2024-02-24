import venueModel from "../model/venuemodel.js";

const venueController = {
  addVenue: async (req, res) => {
    const userId = req.userId;

    const {
      venueName,
      venueCapacity,
      venueStaff,
      venueParkingAvaliable,
      venueType,
      venuePrice,
      description,
      venueTimeSlot,
      venueImages,
      venueFacility,
      unit,
    } = req.body;

    const getVenueData = await venueModel.findOne({ ownerinfo: userId });

    if (getVenueData) {
      return res.status(409).json({ message: "Vendor already have a venue" });
    }
    const venueInfo = await venueModel.create({
      ownerinfo: userId,
      venueName,
      venueCapacity,
      venueStaff,
      venueParkingAvaliable,
      venueType,
      venuePrice,
      description,
      venueTimeSlot,
      venueImages,
      venueFacility,
      unit,
    });

    return res.status(201).json({ message: "venue created" });
  },
  updateVenue: async (req, res) => {
    const userId = req.userId;

    const {
      venueName,
      venueCapacity,
      venueStaff,
      venueParkingAvaliable,
      venueType,
      venuePrice,
      description,
      venueTimeSlot,
      venueImages,
      venueFacility,
      unit,
    } = req.body;

    const venueInfo = await venueModel.findOneAndUpdate(
      {
        ownerinfo: userId,
      },
      {
        venueName,
        venueCapacity,
        venueStaff,
        venueParkingAvaliable,
        venueType,
        venuePrice,
        description,
        venueTimeSlot,
        venueImages,
        venueFacility,
        unit,
      }
    );

    return res.status(200).json({ message: "venue update" });
  },
  getVenue: async (req, res) => {
    const userId = req.userId;

    const getVenueData = await venueModel.findOne({ ownerinfo: userId });

    if (!getVenueData) {
      return res.status(200).json({ message: "no venue added", content: {} });
    }

    return res
      .status(200)
      .json({ message: "venue Data", content: getVenueData });
  },
};

export default venueController;
