import PhotoGrapherModel from "../model/photographermodel.js";

const photographerControllers = {
  addPackage: async (req, res) => {
    const userId = req.userId;

    const {
      videography,
      photography,
      deliverables,
      name,
      noOfPhotos,
      price,
      images,
      description,
    } = req.body;
    if (images == undefined || images == null || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let Photographers = await PhotoGrapherModel.findOne({ ownerinfo: userId });

    if (!Photographers) {
      Photographers = new PhotoGrapherModel({
        ownerinfo: userId,
      });
    }

    const newPackage = {
      videography,
      photography,
      deliverables,
      name,
      noOfPhotos,
      price,
      images,
      description,
    };

    Photographers.package.push(newPackage);

    await Photographers.save();

    res.status(201).json({ message: "Package added" });
  },
  editpackage: async (req, res) => {
    const userId = req.userId;
    const {
      packageid,
      videography,
      photography,
      deliverables,
      name,
      noOfPhotos,
      price,
      description,
      images,
    } = req.body;

    if (images == undefined || images == null || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let Photographers = await PhotoGrapherModel.findOne({ ownerinfo: userId });

    const packageIndex = Photographers.package.findIndex(
      (item) => item._id.toString() === packageid
    );

    if (packageIndex === -1) {
      return res.status(404).json({ message: "no such package found" });
    }

    Photographers.package[packageIndex].videography = videography;
    Photographers.package[packageIndex].photography = photography;
    Photographers.package[packageIndex].deliverables = deliverables;
    Photographers.package[packageIndex].name = name;
    Photographers.package[packageIndex].price = price;
    Photographers.package[packageIndex].noOfPhotos = noOfPhotos;
    Photographers.package[packageIndex].description = description;
    Photographers.package[packageIndex].images = images;

    await Photographers.save();
    return res.status(200).json({ message: "package updated" });
  },
  deletePackage: async (req, res) => {
    const userId = req.userId;
    const { packageid } = req.body;

    let Photographers = await PhotoGrapherModel.findOne({ ownerinfo: userId });

    const packageIndex = Photographers.package.findIndex(
      (item) => item._id.toString() === packageid
    );

    if (packageIndex === -1) {
      return res.status(404).json({ message: "no such package found" });
    }

    Photographers.package.splice(packageIndex, 1);

    await Photographers.save();

    return res.status(200).json({ message: "package deleted" });
  },
  getAllPackages: async (req, res) => {
    const userId = req.userId;

    let Photographers = await PhotoGrapherModel.findOne({ ownerinfo: userId });
    if (!Photographers) {
      Photographers = await new PhotoGrapherModel({
        ownerinfo: userId,
      }).save();
    }
    if (req.query.packageId) {
      const packageItemIndex = Photographers.package.findIndex(
        (item) => item._id.toString() === req.query.packageId
      );
      if (packageItemIndex === -1) {
        return res.status(404).json({ message: "package  not found" });
      }
      const packageInfo = Photographers.package[packageItemIndex];
      return res
        .status(200)
        .json({ message: "package detail ", content: packageInfo });
    } else {
      const packages = Photographers.package;

      return res
        .status(200)
        .json({ message: "All packages ", content: packages });
    }
  },
};

export default photographerControllers;
