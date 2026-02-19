const HelpRequest = require("../models/helpRequestModel");
const NGO = require("../models/ngoModel");

/* ================= GET NGO DASHBOARD STATS ================= */
const getNGODashboardStats = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const acceptedRequests = await HelpRequest.countDocuments({
      assignedTo: ngo._id,
      status: "accepted",
    });

    const completedRequests = await HelpRequest.countDocuments({
      assignedTo: ngo._id,
      status: "resolved",
    });

    // 🔥 FIXED PART
    const nearbyPendingRequests = await HelpRequest.find({
      status: "pending",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: ngo.location.coordinates,
          },
          $maxDistance: 35000,
        },
      },
    });

    const pendingNearby = nearbyPendingRequests.length;

    res.status(200).json({
      pendingNearby,
      acceptedRequests,
      completedRequests,
    });
  } catch (error) {
    console.error("NGO Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET NEARBY REQUESTS ================= */
const getNearbyRequests = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const requests = await HelpRequest.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: ngo.location.coordinates,
          },
          distanceField: "distance",
          maxDistance: 35000,
          spherical: true,
          query: { status: "pending" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      ngoLocation: ngo.location.coordinates,
      requests,
    });
  } catch (error) {
    console.error("Nearby Request Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ACCEPT REQUEST (SAFE) ================= */
const acceptRequest = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const request = await HelpRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        status: "accepted",
        assignedTo: ngo._id,
      },
      { new: true },
    );

    if (!request) {
      return res.status(400).json({
        message: "Request already accepted by another NGO",
      });
    }

    res.status(200).json({
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= COMPLETE REQUEST ================= */
const completeRequest = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      !request.assignedTo ||
      request.assignedTo.toString() !== ngo._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "resolved";
    await request.save();

    res.status(200).json({
      message: "Request marked as completed",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ACCEPTED REQUESTS ================= */
const getAcceptedRequests = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const requests = await HelpRequest.find({
      assignedTo: ngo._id,
      status: "accepted",
    }).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Accepted Request Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNGODashboardStats,
  getNearbyRequests,
  acceptRequest,
  completeRequest,
  getAcceptedRequests,
};
