import jwt from "jsonwebtoken";
import constant from "../constant.js";

function isTokenExpired(decoded) {
  if (decoded && decoded.exp) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTimestamp;
  }
  return true;
}

const authHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, constant.JWT_KEY);

    const userId = decodedToken.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized no token provided" });
    } else if (isTokenExpired(decodedToken)) {
      return res.status(401).json({ message: "Unauthorized token expired" });
    } else {
      req.userId = userId;
      next();
    }
  } catch (e) {
    next(e);
  }
};
export default authHandler;
