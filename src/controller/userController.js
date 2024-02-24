import constant from "../constant.js";
import mailingController from "../middleware/mailSending.js";
import BookingModel from "../model/bookingmodel.js";
import vendorModel from "../model/vendormodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import VendorPassRecoveryModel from "../model/vendorPassRecoverymodel.js";
import mongoose from "mongoose";
import Users from "../model/usermodel.js";
import { getSocketInstance } from "../middleware/socketInstance.js";

const Authentication = {
  // Signup
  signUp: async (req, res) => {
    const { name, email, password, phoneNo } = req.body;
    const hasUser = await Users.findOne({ email: email });
    if (hasUser) {
      return res.status(400).json({ message: "email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      phoneNo,
    });

    return res.status(201).json({ message: "user registered successfully." });
  },

  signUpVendor: async (req, res) => {
    const { name, email, password, phoneNo } = req.body;
    const hasvendor = await vendorModel.findOne({ email: email });
    if (hasvendor) {
      return res.status(400).json({ message: "email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await vendorModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNo,
    });
    const token = jwt.sign({ id: vendor._id }, constant.JWT_KEY, {
      expiresIn: "3h",
    });
    return res
      .status(201)
      .json({ message: "Vendor registered successfully.", token });
  },

  // Login
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    // if email is not found in our vendor model
    if (!user) {
      return res.status(404).json({ message: "no such user found", token: "" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.", token: "" });
    }

    const token = jwt.sign({ id: user._id }, constant.JWT_KEY, {
      expiresIn: "3h",
    });

    return res.status(200).json({
      message: "login success",
      token,
    });
  },

  loginVendor: async (req, res) => {
    const { email, password } = req.body;

    const vendor = await vendorModel
      .findOne({ email })
      .populate("BussinessDetail");

    // if email is not found in our vendor model
    if (!vendor) {
      return res.status(404).json({ message: "no such user found", token: "" });
    }

    if (vendor.pending) {
      return res
        .status(401)
        .json({ message: "Your account is pending", token: "" });
    }

    if (vendor.rejected) {
      return res
        .status(401)
        .json({ message: "Your account is rejected", token: "" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.", token: "" });
    }

    const token = jwt.sign({ id: vendor._id }, constant.JWT_KEY, {
      expiresIn: "3h",
    });

    return res.status(200).json({
      message: "login success",
      token,
      bntype: vendor.BussinessDetail.bnType,
    });
  },

  // Getting user Data here
  getVendorData: async (req, res) => {
    const userId = req.userId;
    const user = await vendorModel
      .findById(userId)
      .populate("BussinessDetail")
      .select("-password");

    let bookingCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let canceledCount = 0;

    const findBooking = await BookingModel.find({
      vendorId: userId,
    });
    bookingCount = findBooking.length ?? bookingCount;
    pendingCount = findBooking.filter(
      (e) => e.canceled == false && e.completed == false
    ).length;
    completedCount = findBooking.filter(
      (e) => e.canceled == false && e.completed == true
    ).length;
    canceledCount = findBooking.filter(
      (e) => e.canceled == true && e.completed == false
    ).length;
    // .populate({
    //   path: "BussinessDetail",
    //   populate: {
    //     path: "ratingInfo",
    //     model: "Reviews",
    //   },
    // })

    if (user) {
      return res.status(200).json({
        message: "user data success",
        user,
        bookingCount,
        pendingCount,
        completedCount,
        canceledCount,
      });
    }

    return res.status(404).json({ message: "no user found", user: null });
  },
  getUserData: async (req, res) => {
    const userId = req.userId;

    const user = await Users.findById({ _id: userId })
      .select("-password")
      .select("-_id");
    if (!user) {
      return res.status(404).json({ message: "no such user found" });
    }
    return res.status(200).json({ message: "success", content: user });
  },

  updateVendorData: async (req, res) => {
    const userId = req.userId;
    const { name, email, phoneNo } = req.body;

    const isUser = await vendorModel.findById({ _id: userId });
    if (!isUser) {
      return res.status(404).json({ message: "no user found" });
    }

    await vendorModel.findByIdAndUpdate(userId, { name, email, phoneNo });

    return res.status(200).json({ message: "user updated successfully" });
  },
  updateVendorPassword: async (req, res) => {
    const userId = req.userId;
    const { password, oldPassword } = req.body;

    const isUser = await vendorModel.findById({ _id: userId });
    if (!isUser) {
      return res.status(404).json({ message: "no user found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, isUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await vendorModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ message: "user updated successfully" });
  },
  forgotVendorPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const isRecovery = await VendorPassRecoveryModel.findOne({ email });
    if (isRecovery && isRecovery.expiredAt > new Date()) {
      mailingController.forgotPasswordMail(
        email,
        `http://localhost:3000/recoverPassword?id=${isRecovery._id}`
      );

      return res.status(200).json({ message: "recovery email send" });
    }

    if (isRecovery && isRecovery.expiredAt < new Date()) {
      await VendorPassRecoveryModel.findByIdAndDelete(isRecovery._id);
    }

    const vendor = await vendorModel.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "no such vendor found" });
    }

    //expiry for 3h
    const recovery = await VendorPassRecoveryModel.create({
      email,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 3),
    });
    const urlToRecover = `http://localhost:3000/recoverPassword?id=${recovery._id}`;

    mailingController.forgotPasswordMail(email, urlToRecover);

    return res.status(200).json({ message: "recovery email send" });
  },
  resetVendorPassword: async (req, res) => {
    const { password, id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid id" });
    }
    const isRecovery = await VendorPassRecoveryModel.findById({ _id: id });
    if (!isRecovery) {
      return res
        .status(404)
        .json({ message: "no such recovery request found" });
    }
    if (isRecovery.expiredAt < new Date()) {
      await VendorPassRecoveryModel.findByIdAndDelete(isRecovery._id);
      return res.status(400).json({ message: "recovery link expired" });
    }

    const vendor = await vendorModel.findOne({ email: isRecovery.email });

    //your old password can't be your new password
    const isoldPassword = await bcrypt.compare(password, vendor.password);

    if (isoldPassword) {
      return res
        .status(400)
        .json({ message: "your old password can not be your new password" });
    }

    await vendorModel.findByIdAndUpdate(vendor._id, {
      password: await bcrypt.hash(password, 10),
    });
    await VendorPassRecoveryModel.findByIdAndDelete(isRecovery._id);

    return res.status(200).json({ message: "password reset successfully" });
  },
};

export default Authentication;

//http://ec2-35-74-182-67.ap-northeast-1.compute.amazonaws.com:2000/login
