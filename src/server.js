import express from "express";
import promiseHandler from "./middleware/promiseHandler.js";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import constant from "./constant.js";
import connectToDB from "./dbconnection.js";
import userRouter from "./router/userRouter.js";
import bussinessRouter from "./router/bussinessRouter.js";
import reviewRouter from "./router/reviewRouter.js";
import catersRouter from "./router/catersRouter.js";
import venueRouter from "./router/venueRouter.js";
import photographersRouter from "./router/photographerRouter.js";
import bookingRouter from "./router/bookingRouter.js";
import adminRouter from "./router/adminRouter.js";
import requestsRouter from "./router/requestsRouter.js";
import { Server } from "http";
import { Server as socket } from "socket.io";
import { setSocketInstance } from "./middleware/socketInstance.js";
import handleSocketsEvent from "./middleware/socketHandler.js";

const app = express();
var http = Server(app);

app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(requestsRouter);
app.use(bussinessRouter);
app.use(reviewRouter);
app.use(catersRouter);
app.use(venueRouter);
app.use(photographersRouter);
app.use(bookingRouter);
app.use(adminRouter);

app.get("/", (req, res) => {
  res.status(200).send("<h1> Wellcome to taqreebat backend</h1>");
});

// don't change there position use all the routers and middleware above these
app.use(promiseHandler);
app.use(errorHandler);

connectToDB();

const io = new socket(http, {
  cors: {
    origin: "*",
  },
});

setSocketInstance(io);

handleSocketsEvent(io);

http.listen(constant.PORT, () => {
  console.log(`server is running on port ${constant.PORT}`);
});
