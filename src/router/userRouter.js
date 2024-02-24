import express from "express";
import Authentication from "../controller/userController.js";
import authHandler from "../middleware/authHandler.js";

const userRouter = express.Router();

//get
userRouter.get("/getVendorData", authHandler, Authentication.getVendorData);
userRouter.get("/getUserData", authHandler, Authentication.getUserData);

//post
userRouter.post("/signup", Authentication.signUp);
userRouter.post("/login", Authentication.login);
userRouter.post("/signupVendor", Authentication.signUpVendor);
userRouter.post("/loginVendor", Authentication.loginVendor);
userRouter.post("/recoverVendorpass", Authentication.forgotVendorPassword);
userRouter.post("/resetrecoverVendorpass", Authentication.resetVendorPassword);

//put

userRouter.put(
  "/updateVendorData",
  authHandler,
  Authentication.updateVendorData
);
userRouter.put(
  "/resetVendorPassword",
  authHandler,
  Authentication.updateVendorPassword
);

export default userRouter;
