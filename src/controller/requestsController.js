import BookingModel from "../model/bookingmodel.js";
import paymentModel from "../model/paymentmodel.js";
import RequestsModel from "../model/requestmodel.js";
import Users from "../model/usermodel.js";
import Vendor from "../model/vendormodel.js";

const requestsController = {
  addRequest: async (req, res) => {
    const userId = req.userId;
    const {
      vendorId,
      personCount,
      bookingDate,
      bookingTime,
      bookingDetail,
      typeofEvent,
    } = req.body;

    await RequestsModel.create({
      vendorId,
      userId,
      typeofEvent,
      personCount,
      bookingDate,
      bookingTime,
      bookingDetail,
      userConfirmation: 1,
    });

    return res.status(201).json({ message: "success" });
  },
  getUsersRequest: async (req, res) => {
    const userId = req.userId;
    const requests = await RequestsModel.find({
      userId: userId,
      userConfirmation: 0,
    });
    return res.status(200).json({ requests });
  },
  getVendorsRequest: async (req, res) => {
    const vendorId = req.userId;
    const requests = await RequestsModel.find({
      vendorId: vendorId,
      vendorConfirmation: 0,
    }).populate({
      path: "userId",
      select: "-password",
    });
    return res.status(200).json({ requests });
  },
  // quoteRequest: async (req, res) => {
  //   const { requestId, quote } = req.body;
  //   await RequestsModel.findByIdAndUpdate(requestId, { quotedDetail: quote });
  //   return res.status(200).json({ message: "success" });
  // },
  confirmRequest: async (req, res) => {
    const personId = req.userId;
    const { requestId, action } = req.body;
    var userType =
      (await Vendor.findById(personId)) !== null ? "vendor" : "user";
    console.log(userType);
    if (userType === "user") {
      await RequestsModel.findByIdAndUpdate(requestId, {
        userConfirmation: action,
      });
    } else if (userType === "vendor") {
      await RequestsModel.findByIdAndUpdate(requestId, {
        vendorConfirmation: action,
      });
      if (action == 1) {
        const request = await RequestsModel.findById(requestId);
        const userDetail = await Users.findById(request.userId);
        const paymentInfo = await paymentModel.create({
          totalAmount: request.bookingDetail.totalPrice,
          amountPending: request.bookingDetail.totalPrice,
          amountPaid: 0,
          paymentStatus: "pending",
        });
        await BookingModel.create({
          vendorId: request.vendorId,
          customerId: request.userId,
          personCount: request.personCount,
          customerName: userDetail.name,
          customerContactNo: userDetail.phoneNo,
          typeofEvent: request.typeofEvent,
          bookingDate: request.bookingDate,
          bookingTime: request.bookingTime,
          isWalkInCustomer: false,
          paymentInfo: paymentInfo._id,
          details: request.bookingDetail,
        });
      }
    }
    return res.status(200).json({ message: "success" });
  },
};

export default requestsController;
