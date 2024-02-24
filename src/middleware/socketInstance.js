let io = null;

// set this when you initialize the io
export const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};
//  you can call this anywhere
export const getSocketInstance = () => {
  return io;
};
