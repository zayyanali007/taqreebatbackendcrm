import { vendorsContentBasedFiltering } from "../middleware/contentBasedFilterHandler.js";
import Users from "../model/usermodel.js";
import Vendor from "../model/vendormodel.js";

const adminController = {
  // Getting user Data here
  getAdminData: async (req, res) => {
    const userId = req.userId;
    const user = await Vendor.findById(userId)
      .populate("BussinessDetail")
      .select("-password");

    const vendor = await Vendor.find({
      _id: { $ne: userId },
    });

    const users = await Users.find({});

    let completedCount = 0;
    let canceledCount = 0;

    if (user) {
      return res.status(200).json({
        message: "user data success",
        user,
        vendorsCount: vendor.length,
        usersCount: users.length,
        completedCount,
        canceledCount,
      });
    }

    return res.status(404).json({ message: "no user found", user: null });
  },
  getAllPendingVendors: async (req, res) => {
    const userId = req.userId;
    const { chipId, filters } = req.body;

    if (filters && Object.keys(filters).length > 0) {
      vendorsContentBasedFiltering(req, res);
    } else {
      const vendor = await Vendor.find({
        pending: chipId === 1,
        _id: { $ne: userId },
        accepted: chipId === 4 || chipId === 2,
        rejected: chipId === 3,
        featured: chipId === 2 ? { $in: [true, false] } : chipId === 4,
        BussinessDetail: { $ne: null },
      })
        .populate("BussinessDetail")
        .select("-password");

      return res.status(200).json({ message: "success", content: vendor });
    }
  },
  approveVendors: async (req, res) => {
    const userId = req.userId;
    const { vendorId, accepted } = req.body;
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    await Vendor.findByIdAndUpdate(vendorId, {
      pending: false,
      accepted: accepted ? accepted : false,
      rejected: accepted ? false : true,
    });
    return res.status(200).json({
      message: `vendor ${accepted ? "approved" : "rejected"} successfully`,
    });
  },
  makeFeatured: async (req, res) => {
    const userId = req.userId;
    const { vendorId, condition } = req.body;
    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    await Vendor.findByIdAndUpdate(vendorId, {
      featured: condition,
    });
    return res.status(200).json({
      message: `vendor ${
        condition ? "made featured" : "removed from featured"
      } successfully`,
    });
  },
};

export default adminController;
