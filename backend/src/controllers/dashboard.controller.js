import { getDashboardOverview } from "../services/dashboard.service.js";

export const getOverview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: "UnAuthorized." 
      });
    }

    const userId = req.user.id;
    const overviewData = await getDashboardOverview(userId);

    return res.status(200).json(overviewData);

  } catch (error) {
    return res.status(500).json({ 
      message: "An error occurred while fetching dashboard overview data", 
      details: error.message 
    });
  }
};