import mongoose from 'mongoose';

/**
 * VehicleType Model
 * Stores transport vehicle categories with server-controlled pricing.
 * Admin manages this collection — frontend never hardcodes prices.
 */
const vehicleTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Motorcycle", "3 Wheeler", "Mini Truck", "Pickup 8ft", "Truck 14ft"
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // e.g. "motorcycle", "three-wheeler", "mini-truck"
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    capacityKg: {
      type: Number,
      required: true,
      min: 1,
      // Max cargo weight the vehicle can carry (kg)
    },
    icon: {
      type: String,
      default: 'truck',
      // Frontend icon identifier: "bike", "truck", etc.
    },

    // ── Pricing (all in INR) ──────────────────────────────────────────
    baseFare: {
      type: Number,
      required: true,
      min: 0,
      // Flat charge applied to every booking regardless of distance
    },
    perKmFare: {
      type: Number,
      required: true,
      min: 0,
      // Added per km travelled
    },
    minimumFare: {
      type: Number,
      required: true,
      min: 0,
      // If (baseFare + distanceCharge) < minimumFare, use minimumFare
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      // Fixed platform/service charge added on top of ride fare
    },
    // ─────────────────────────────────────────────────────────────────

    isActive: {
      type: Boolean,
      default: true,
      // Admin can deactivate a vehicle type without deleting it
    },
    sortOrder: {
      type: Number,
      default: 0,
      // Controls display order in the UI (ascending)
    },
  },
  {
    timestamps: true,
    collection: 'vehicletypes',
  }
);

const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);
export default VehicleType;
