import mongoose from "mongoose";

import constant from "./constant.js";

const connectToDB = () => {
  mongoose
    .connect(constant.DBKey)
    .then(() => {
      console.log("success");
    })
    .catch((e) => {
      console.log(`error is ${e}`);
    });
};

export default connectToDB;
