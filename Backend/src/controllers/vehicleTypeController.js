import VehicleType from '../models/VehicleType.model.js';

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/transport/vehicles
// Public — no auth required
// Returns all active vehicle types sorted by sortOrder
// ──────────────────────────────────────────────────────────────────────────────
export const getActiveVehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleType.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/transport/vehicles/:id
// Public — no auth required
// Returns a single vehicle type by ID (for fare estimate re-validation)
// ──────────────────────────────────────────────────────────────────────────────
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await VehicleType.findOne({
      _id: req.params.id,
      isActive: true,
    }).select('-__v');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle type not found or is currently unavailable',
      });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    next(error);
  }
};
