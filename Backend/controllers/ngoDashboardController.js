const { HelpRequest, NGO } = require("../models/index");
const { sequelize } = require("../config/db");

/* ===============================================================
   Haversine distance SQL snippet (returns metres)
   =============================================================== */
const haversineExpr = (ngoLat, ngoLng) => `
  (6371000 * ACOS(
    COS(RADIANS(${ngoLat})) * COS(RADIANS(hr.latitude)) *
    COS(RADIANS(hr.longitude) - RADIANS(${ngoLng})) +
    SIN(RADIANS(${ngoLat})) * SIN(RADIANS(hr.latitude))
  ))
`;

/* ================= GET NGO DASHBOARD STATS ================= */
const getNGODashboardStats = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });
    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const acceptedRequests = await HelpRequest.count({
      where: { assignedToId: ngo.id, status: "accepted" },
    });

    const completedRequests = await HelpRequest.count({
      where: { assignedToId: ngo.id, status: "resolved" },
    });

    // Count nearby pending requests using Haversine
    const [{ pendingNearby }] = await sequelize.query(
      `SELECT COUNT(*) AS pendingNearby
       FROM HelpRequests hr
       WHERE hr.status = 'pending'
       AND ${haversineExpr(ngo.latitude, ngo.longitude)} <= 35000`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({
      pendingNearby: Number(pendingNearby),
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
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });
    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    // Raw query with Haversine distance, ordered by closest first
    const requests = await sequelize.query(
      `SELECT hr.*,
              ${haversineExpr(ngo.latitude, ngo.longitude)} AS distance
       FROM HelpRequests hr
       WHERE hr.status = 'pending'
       AND ${haversineExpr(ngo.latitude, ngo.longitude)} <= 35000
       ORDER BY hr.createdAt DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Parse imageUrls for each row (stored as JSON string)
    const parsed = requests.map((r) => ({
      ...r,
      imageUrls: r.imageUrls ? JSON.parse(r.imageUrls) : [],
    }));

    res.status(200).json({
      ngoLocation: [ngo.longitude, ngo.latitude],
      requests: parsed,
    });
  } catch (error) {
    console.error("Nearby Request Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ACCEPT REQUEST ================= */
const acceptRequest = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });
    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const [updated] = await HelpRequest.update(
      { status: "accepted", assignedToId: ngo.id },
      { where: { id: req.params.id, status: "pending" } }
    );

    if (!updated) {
      return res.status(400).json({
        message: "Request already accepted by another NGO",
      });
    }

    const request = await HelpRequest.findByPk(req.params.id);

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
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });
    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const request = await HelpRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!request.assignedToId || request.assignedToId !== ngo.id) {
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
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });
    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const requests = await HelpRequest.findAll({
      where: { assignedToId: ngo.id, status: "accepted" },
      order: [["createdAt", "DESC"]],
    });

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
