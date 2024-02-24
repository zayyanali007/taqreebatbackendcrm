import BusinessModel from "../model/bussinessmodel.js";

export const addUserView = async (businessId) => {
  try {
    // Update the peopleViewed attribute by incrementing it by 1
    await BusinessModel.findByIdAndUpdate(businessId, {
      $inc: { peopleViewed: 1 },
    });
  } catch (error) {
    // console.error("Error adding user view:", error);
    throw error;
  }
};

export const collaborativeFilteringMostViewed = async (res, vendor) => {
  const mostViewedBusinesses = vendor
    .slice()
    .sort(
      (a, b) => b.BussinessDetail.peopleViewed - a.BussinessDetail.peopleViewed
    )
    .slice(0, 5);

  return res.status(200).json({
    message: "Most viewed businesses",
    content: mostViewedBusinesses,
  });
};
