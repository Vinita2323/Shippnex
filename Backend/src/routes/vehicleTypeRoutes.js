import express from 'express';
import { getActiveVehicles, getVehicleById } from '../controllers/vehicleTypeController.js';

const router = express.Router();

// GET /api/transport/vehicles        — list all active vehicle types (public)
router.get('/', getActiveVehicles);

// GET /api/transport/vehicles/:id    — get single vehicle type (public)
router.get('/:id', getVehicleById);

export default router;
