import {
  addUserView,
  collaborativeFilteringMostViewed,
} from "../middleware/collaborativeFilterHandler.js";
import { getSocketInstance } from "../middleware/socketInstance.js";
import BusinessModel from "../model/bussinessmodel.js";
import CatersModel from "../model/catersmodel.js";
import PhotoGrapherModel from "../model/photographermodel.js";
import RatingModel from "../model/reviewmodel.js";
import Vendor from "../model/vendormodel.js";
import venueModel from "../model/venuemodel.js";

const BussinessController = {
  //Add bussiness
  addBussinessDetail: async (req, res) => {
    const userId = req.userId;
    const {
      BussinessName,
      ContactNo,
      email,
      bnlogo,
      city,
      Address,
      bnType,
      website,
      coverPhotos,
    } = req.body;
    const ratingDetail = await RatingModel.create({});
    const createBussiness = await BusinessModel.create({
      BussinessName,
      ContactNo,
      email,
      bnlogo,
      city,
      Address,
      bnType,
      website,
      ratingInfo: ratingDetail._id,
      coverPhotos,
    });

    const vendorData = await Vendor.findById(userId);
    if (vendorData.BussinessDetail == null) {
      await Vendor.findByIdAndUpdate(userId, {
        BussinessDetail: createBussiness._id,
      });
      const io = getSocketInstance();
      const data = { BussinessName, bnlogo };
      io.sockets.emit("VendorRegisterRequest", data);
      return res.status(201).json({ message: "bussiness detail added" });
    } else {
      return res
        .status(403)
        .json({ message: "The vendor already has a bussiness" });
    }
  },

  //Update
  updateBussinessDetail: async (req, res) => {
    const userId = req.userId;
    const { updateOption } = req.body;

    const vendor = await Vendor.findById(userId);

    await BusinessModel.findByIdAndUpdate(
      vendor.BussinessDetail._id,
      updateOption
    );

    return res.status(200).json({ message: "bussiness detail updated" });
  },

  //get
  getBussinessDetail: async (req, res) => {
    const userId = req.userId;

    const vendor = await Vendor.findById(userId);
    if (vendor.BussinessDetail == null) {
      return res.status(404).json({ message: "vendor has no bussiness" });
    }

    const bussinessDetail = await BusinessModel.findById(
      vendor.BussinessDetail._id
    ).populate("ratingInfo");

    return res
      .status(200)
      .json({ message: "bussiness detail", bussinessDetail });
  },
  getAllBussinessDetail: async (req, res) => {
    const { type, page } = req.query;

    const size = 10;
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    const approvedVendors = await Vendor.find({ accepted: true })
      .populate({
        path: "BussinessDetail",
        populate: {
          path: "ratingInfo",
          model: "Reviews",
        },
      })
      .select("-password");

    const filteredVendors = approvedVendors.filter(
      (data) => data.BussinessDetail && data.BussinessDetail.bnType === type
    );

    const totalItems = filteredVendors.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedVendors = filteredVendors
      .slice(offset, offset + limit)
      .map((data) => ({
        vendorId: data._id,
        ...data.BussinessDetail._doc,
      }));

    return res.status(200).json({
      message: "All Vendors Data",
      content: paginatedVendors,
      totalPages,
      currentPage: page ? +page : 1,
    });
  },
  // getAllBussinessDetail: async (req, res) => {
  //   const { type, page } = req.query;

  //   const size = 10;

  //   const limit = size ? +size : 10;
  //   const offset = page ? page * limit : 0;
  //   const approvedVendors = await Vendor.find({ accepted: true })
  //     .skip(offset)
  //     .limit(limit)
  //     .populate({
  //       path: "BussinessDetail",
  //       populate: {
  //         path: "ratingInfo",
  //         model: "Reviews",
  //       },
  //     })
  //     .select("-password");

  //   const bussinessfilter = approvedVendors.filter((data) => {
  //     return data.BussinessDetail.bnType === type;
  //   });

  //   const bussiness = bussinessfilter.map((data) => {
  //     const { BussinessDetail, _id } = data;
  //     return {
  //       vendorId: _id,
  //       ...BussinessDetail._doc,
  //     };
  //   });

  //   return res
  //     .status(200)
  //     .json({ message: "All Vendors Data", content: bussiness });
  // },
  getDetailOnVendorId: async (req, res) => {
    const { vendorId, type } = req.body;

    if (type == null || type == undefined) {
      return res
        .status(400)
        .json({ message: "type parameter in body is required" });
    }

    const findVendorData = await Vendor.findById({ _id: vendorId })
      .populate({
        path: "BussinessDetail",
        populate: {
          path: "ratingInfo",
          model: "Reviews",
          populate: {
            path: "reviews.userinfo",
            select: "-password",
          },
        },
      })
      .select("-password");

    await addUserView(findVendorData.BussinessDetail._id);

    if (type === "Caterer") {
      const body = await CatersModel.findOne({ ownerinfo: vendorId });
      return res.status(200).json({
        message: "success",
        content: { body, bussinessData: findVendorData.BussinessDetail },
      });
    } else if (type === "Photographer") {
      const body = await PhotoGrapherModel.findOne({ ownerinfo: vendorId });
      return res.status(200).json({
        message: "success",
        content: { body, bussinessData: findVendorData.BussinessDetail },
      });
    } else {
      const body = await venueModel.findOne({ ownerinfo: vendorId });
      return res.status(200).json({
        message: "success",
        content: { body, bussinessData: findVendorData.BussinessDetail },
      });
    }
  },
  //featured
  getFeatured: async (req, res) => {
    const { type } = req.query;

    const vendor = await Vendor.find({
      featured: true,
    })

      .populate({
        path: "BussinessDetail",
        populate: {
          path: "ratingInfo",
          model: "Reviews",
        },
      })
      .select("-password");

    if (type && type !== "Most Viewed") {
      const bussinessfilter = vendor.filter((data) => {
        return data.BussinessDetail.bnType === type;
      });
      return res
        .status(200)
        .json({ message: "featured business", content: bussinessfilter });
    } else if (type === "Most Viewed") {
      collaborativeFilteringMostViewed(res, vendor);
    } else {
      return res
        .status(200)
        .json({ message: "featured business", content: vendor });
    }
  },
  //delete
  deleteBussinessDetail: async (req, res) => {
    const userId = req.userId;

    const vendor = await Vendor.findById(userId);

    await BusinessModel.findByIdAndDelete(vendor.BussinessDetail._id);

    await Vendor.findByIdAndUpdate(userId, { BussinessDetail: null });

    return res.status(202).json({ message: "bussiness deleted" });
  },
};

export default BussinessController;
