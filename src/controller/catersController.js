import CatersModel from "../model/catersmodel.js";

const CatersController = {
  // Menu Items
  addFoodMenu: async (req, res) => {
    const userId = req.userId;
    const { category, name, price, unit, images } = req.body;

    if (!images || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    if (!caters) {
      caters = new CatersModel({
        ownerinfo: userId,
      });
    }

    const newFoodMenuItem = {
      category,
      name,
      price,
      unit,
      images,
    };

    caters.FoodMenu.push(newFoodMenuItem);

    await caters.save();

    res.status(201).json({ message: "Food item added" });
  },
  editMenuItem: async (req, res) => {
    const userId = req.userId;
    const { menuid, category, name, price, unit, images } = req.body;
    if (images == undefined || images == null || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    const menuItemIndex = caters.FoodMenu.findIndex(
      (item) => item._id.toString() === menuid
    );

    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    caters.FoodMenu[menuItemIndex].category = category;
    caters.FoodMenu[menuItemIndex].name = name;
    caters.FoodMenu[menuItemIndex].price = price;
    caters.FoodMenu[menuItemIndex].unit = unit;
    caters.FoodMenu[menuItemIndex].images = images;

    await caters.save();
    return res.status(200).json({ message: "Menu Item updated" });
  },
  deleteMenuItem: async (req, res) => {
    const userId = req.userId;
    const { menuid } = req.body;

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    const menuItemIndex = caters.FoodMenu.findIndex(
      (item) => item._id.toString() === menuid
    );

    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    caters.FoodMenu.splice(menuItemIndex, 1);

    await caters.save();

    return res.status(200).json({ message: "Menu item deleted" });
  },
  getAllMenuItems: async (req, res) => {
    const userId = req.userId;

    let caters = await CatersModel.findOne({ ownerinfo: userId });
    if (!caters) {
      caters = await new CatersModel({
        ownerinfo: userId,
      }).save();
    }

    if (req.query.itemId) {
      const menuItemIndex = caters.FoodMenu.findIndex(
        (item) => item._id.toString() === req.query.itemId
      );
      if (menuItemIndex === -1) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const menuItem = caters.FoodMenu[menuItemIndex];
      return res.status(200).json({ message: "Menu item ", menuItem });
    } else {
      const menuItems = caters.FoodMenu;

      return res
        .status(200)
        .json({ message: "Menu items ", content: menuItems });
    }
  },

  // Packages
  addPackage: async (req, res) => {
    const userId = req.userId;
    const { details, name, unit, price, images, type, description } = req.body;
    if (images == undefined || images == null || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    if (!caters) {
      caters = new CatersModel({
        ownerinfo: userId,
      });
    }

    const newPackage = {
      details,
      name,
      unit,
      price,
      images,
      type,
      description,
    };

    caters.package.push(newPackage);

    await caters.save();

    res.status(201).json({ message: "Package added" });
  },
  editpackage: async (req, res) => {
    const userId = req.userId;
    const { packageid, details, name, unit, price, description, images, type } =
      req.body;

    if (images == undefined || images == null || images.length == 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    const packageIndex = caters.package.findIndex(
      (item) => item._id.toString() === packageid
    );

    if (packageIndex === -1) {
      return res.status(404).json({ message: "no such package found" });
    }

    caters.package[packageIndex].details = details;
    caters.package[packageIndex].type = type;
    caters.package[packageIndex].name = name;
    caters.package[packageIndex].price = price;
    caters.package[packageIndex].unit = unit;
    caters.package[packageIndex].description = description;
    caters.package[packageIndex].images = images;

    await caters.save();
    return res.status(200).json({ message: "package updated" });
  },
  deletePackage: async (req, res) => {
    const userId = req.userId;
    const { packageid } = req.body;

    let caters = await CatersModel.findOne({ ownerinfo: userId });

    const packageIndex = caters.package.findIndex(
      (item) => item._id.toString() === packageid
    );

    if (packageIndex === -1) {
      return res.status(404).json({ message: "no such package found" });
    }

    caters.package.splice(packageIndex, 1);

    await caters.save();

    return res.status(200).json({ message: "package deleted" });
  },
  getAllPackages: async (req, res) => {
    const userId = req.userId;

    let caters = await CatersModel.findOne({ ownerinfo: userId });
    if (!caters) {
      caters = await new CatersModel({
        ownerinfo: userId,
      }).save();
    }
    if (req.query.packageId) {
      const packageItemIndex = caters.package.findIndex(
        (item) => item._id.toString() === req.query.packageId
      );
      if (packageItemIndex === -1) {
        return res.status(404).json({ message: "package  not found" });
      }
      const packageInfo = caters.package[packageItemIndex];
      return res.status(200).json({ message: "package detail ", packageInfo });
    } else {
      const packages = caters.package;

      return res
        .status(200)
        .json({ message: "All packages ", content: packages });
    }
  },
};

export default CatersController;
