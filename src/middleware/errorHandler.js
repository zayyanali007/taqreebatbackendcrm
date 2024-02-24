const errorHandler = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Unauthorized Token expired" });
  }
  return res.status(500).send({ message: err.message });
};
export default errorHandler;
