import BookingModel from "../model/bookingmodel.js";
import Vendor from "../model/vendormodel.js";

export const bookingContentBasedFiltering = async (req, res) => {
  const userId = req.userId;
  const { filters } = req.body;
  try {
    const queryOption = {};
    Object.keys(filters).map((key) => {
      const value = filters[key];
      if (
        value !== "" &&
        value !== undefined &&
        value !== null &&
        value.trim().length > 0
      ) {
        if (key !== "paymentStatus") {
          queryOption[key] = value;
        }
      }
    });

    let content = await BookingModel.find({
      vendorId: userId,
      ...queryOption,
    }).populate("paymentInfo");
    if (filters.paymentStatus) {
      content = content.filter(
        (booking) => booking.paymentInfo.paymentStatus === filters.paymentStatus
      );
    }
    return res.status(200).json({ message: "bookings retrieved", content });
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const vendorsContentBasedFiltering = async (req, res) => {
  const userId = req.userId;
  const { chipId, filters } = req.body;
  try {
    const queryOption = {};
    Object.keys(filters).map((key) => {
      const value = filters[key];
      if (
        value !== "" &&
        value !== undefined &&
        value !== null &&
        value.trim().length > 0
      ) {
        queryOption[key] = value;
      }
    });
    // console.log(queryOption);
    let content = await Vendor.find({
      pending: chipId === 1,
      _id: { $ne: userId },
      accepted: chipId === 4 || chipId === 2,
      rejected: chipId === 3,
      featured: chipId === 2 ? { $in: [true, false] } : chipId === 4,
      BussinessDetail: { $ne: null },
    })
      .populate("BussinessDetail")
      .select("-password");

    if (queryOption.bnType) {
      content = content.filter(
        (booking) => booking.BussinessDetail.bnType === queryOption.bnType
      );
    }

    if (queryOption.city) {
      content = content.filter(
        (booking) =>
          booking.BussinessDetail.city.toLowerCase() ===
          queryOption.city.toLowerCase()
      );
    }

    if (queryOption.BussinessName) {
      content = content.filter((booking) =>
        booking.BussinessDetail.BussinessName.toLowerCase().includes(
          queryOption.BussinessName.toLowerCase()
        )
      );
    }

    if (queryOption.email) {
      content = content.filter((booking) =>
        booking.BussinessDetail.email
          .toLowerCase()
          .includes(queryOption.email.toLowerCase())
      );
    }

    return res.status(200).json({ message: "bookings retrieved", content });
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
