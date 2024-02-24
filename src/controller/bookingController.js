import { bookingContentBasedFiltering } from "../middleware/contentBasedFilterHandler.js";
import BookingModel from "../model/bookingmodel.js";
import paymentModel from "../model/paymentmodel.js";

const BookingController = {
  addWalkInBooking: async (req, res) => {
    const userId = req.userId;

    const {
      customerName,
      customerContactNo,
      typeofEvent,
      bookingDate,
      bookingTime,
      totalAmount,
      personCount,
      downPayment,
      details,
    } = req.body;

    // if (items == undefined || items == null || items.length == 0) {
    //   return res.status(400).json({ message: "Items are required" });
    // } else {

    if (downPayment > totalAmount) {
      return res.status(400).json({
        message: "down payment can not be greater then total payment",
      });
    }
    const paymentInfo = await paymentModel.create({
      totalAmount,
      amountPending:
        downPayment !== undefined && downPayment > 0
          ? totalAmount - downPayment
          : totalAmount,
      amountPaid:
        downPayment !== undefined && downPayment > 0 ? downPayment : 0,
      paymentStatus:
        downPayment !== undefined && downPayment > 0
          ? totalAmount - downPayment == 0
            ? "paid"
            : "advance"
          : "pending",
    });

    await BookingModel.create({
      vendorId: userId,
      customerName,
      customerContactNo,
      typeofEvent,
      bookingDate,
      bookingTime,
      paymentInfo: paymentInfo._id,
      personCount,
      details,
    });

    return res.status(201).json({ message: "booking created" });
    // }
  },

  viewVendorsBooking: async (req, res) => {
    const userId = req.userId;
    const { filters } = req.body;

    if (req.query.bookingId) {
      const booking = await BookingModel.findOne({
        _id: req.query.bookingId,
        canceled: false,
      })
        .populate("paymentInfo")
        .select("-customerId");
      if (booking != null) {
        return res
          .status(200)
          .json({ message: "booking found", content: booking });
      } else {
        return res.status(404).json({ message: "no booking found" });
      }
    } else if (filters && Object.keys(filters).length > 0) {
      bookingContentBasedFiltering(req, res);
    } else {
      const findBooking = await BookingModel.find({
        vendorId: userId,
      })
        .populate("paymentInfo")
        .select("-customerId");

      return res
        .status(200)
        .json({ message: "bookings retrieved", content: findBooking });
    }
  },
  getBookingStatus: async (req, res) => {
    const userId = req.userId;

    if (req.query.bookingId) {
      const booking = await BookingModel.findOne({
        _id: req.query.bookingId,
      });
      if (booking != null) {
        return res.status(200).json({
          message: "booking found",
          status: booking.completed
            ? "completed"
            : booking.canceled
            ? "canceled"
            : "pending",
        });
      } else {
        return res.status(404).json({ message: "no booking found" });
      }
    } else {
      return res.status(404).json({ message: "no bookingId in parameters" });
    }
  },
  viewUsersBooking: async (req, res) => {
    const userId = req.userId;

    if (req.query.bookingId) {
      const booking = await BookingModel.findOne({
        _id: req.query.bookingId,
        canceled: false,
      })
        .populate("paymentInfo")
        .select("-customerId");
      if (booking != null) {
        return res
          .status(200)
          .json({ message: "booking found", content: booking });
      } else {
        return res.status(404).json({ message: "no booking found" });
      }
    } else {
      const findBooking = await BookingModel.find({
        customerId: userId,
        isWalkInCustomer: false,
        canceled: false,
      })
        .populate("paymentInfo")
        .populate({
          path: "vendorId",
          select: "-password",
          populate: {
            path: "BussinessDetail",
          },
        });

      return res
        .status(200)
        .json({ message: "bookings retrieved", content: findBooking });
    }
  },
  updateWalkInVendorBooking: async (req, res) => {
    const userId = req.userId;
    const {
      bookingId,
      customerName,
      customerContactNo,
      typeofEvent,
      bookingDate,
      bookingTime,
      totalAmount,
      personCount,
      downPayment,
      details,
    } = req.body;

    if (downPayment > totalAmount) {
      return res.status(400).json({
        message: "down payment can not be greater then total payment",
      });
    }
    const customerBooking = await BookingModel.findByIdAndUpdate(
      {
        _id: bookingId,
      },
      {
        customerName,
        customerContactNo,
        typeofEvent,
        bookingDate,
        bookingTime,
        personCount,
        details,
      }
    );

    await paymentModel.findByIdAndUpdate(
      { _id: customerBooking.paymentInfo },
      {
        totalAmount: totalAmount,
        amountPending: totalAmount - downPayment,
        amountPaid: downPayment,
        paymentStatus:
          downPayment > 0
            ? totalAmount - downPayment == 0
              ? "paid"
              : "advance"
            : "pending",
      }
    );
    return res.status(200).json({ message: "Booking Updated" });
  },

  addwalkInBookingPayment: async (req, res) => {
    const userId = req.userId;
    const { bookingId, paymentRecieved } = req.body;

    if (paymentRecieved <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid paymentRecieved value " });
    }

    const customerBooking = await BookingModel.findById({
      _id: bookingId,
    })
      .populate("paymentInfo")
      .select("-customerId");

    if (customerBooking.canceled) {
      return res
        .status(400)
        .json({ message: "could not add payment the booking is canceled " });
    }
    if (customerBooking.completed) {
      return res.status(400).json({
        message: "could not add payment the booking is already completed ",
      });
    }

    if (customerBooking == null) {
      return res
        .status(400)
        .json({ message: "no such booking found please check bookingId" });
    }

    if (customerBooking.paymentInfo.amountPending == 0) {
      return res.status(400).json({ message: "all the payment is done" });
    }

    if (paymentRecieved > customerBooking.paymentInfo.amountPending) {
      return res
        .status(400)
        .json({ message: "payment Recieved is greater than pending payment" });
    }

    await paymentModel.findByIdAndUpdate(
      {
        _id: customerBooking.paymentInfo._id,
      },
      {
        amountPending:
          customerBooking.paymentInfo.totalAmount -
          (customerBooking.paymentInfo.amountPaid + paymentRecieved),
        amountPaid: customerBooking.paymentInfo.amountPaid + paymentRecieved,
        paymentStatus:
          customerBooking.paymentInfo.totalAmount -
            (customerBooking.paymentInfo.amountPaid + paymentRecieved) ==
          0
            ? "paid"
            : "advance",
      }
    );
    return res.status(200).json({ message: "payment added" });
  },

  completedBooking: async (req, res) => {
    const userId = req.userId;
    const { bookingId } = req.body;

    const bookingDetail = await BookingModel.findById({
      _id: bookingId,
    }).populate("paymentInfo");

    if (bookingDetail.canceled) {
      return res
        .status(400)
        .json({ message: "canceled booking can not be completed" });
    }

    if (bookingDetail.completed) {
      return res.status(400).json({ message: "booking is already completed" });
    }

    if (bookingDetail.paymentInfo.amountPending == 0) {
      await BookingModel.findByIdAndUpdate(
        { _id: bookingId },
        {
          completed: true,
        }
      );
    } else {
      return res.status(402).json({ message: "payment is pending" });
    }

    return res.status(200).json({ message: "booking completed" });
  },

  canceledBooking: async (req, res) => {
    const userId = req.userId;
    const { bookingId } = req.body;

    const bookingDetail = await BookingModel.findById({
      _id: bookingId,
    }).populate("paymentInfo");

    if (bookingDetail.completed) {
      return res
        .status(400)
        .json({ message: "completed booking can not be canceled" });
    }

    if (bookingDetail.canceled) {
      return res.status(400).json({ message: "booking is already canceled" });
    }

    await BookingModel.findByIdAndUpdate(
      { _id: bookingId },
      {
        canceled: true,
      }
    );

    return res.status(200).json({ message: "booking canceled" });
  },

  getCanceledBooking: async (req, res) => {
    const userId = req.userId;

    const findBooking = await BookingModel.find({
      vendorId: userId,
      canceled: true,
    })
      .populate("paymentInfo")
      .select("-customerId");

    return res
      .status(200)
      .json({ message: "All canceled bookings", content: findBooking });
  },
};

export default BookingController;
