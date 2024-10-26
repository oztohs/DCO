import express from 'express';
import {verifyToken} from '../middlewares/Token';
import { verifyAdmin } from '../middlewares/Admin';
import validateMachine from '../middlewares/validateMachine';
import { flagSubmissionLimiter } from '../middlewares/rateLimiter';
import {
  createMachine,
  getAllMachines,
  getMachineDetails,
  updateMachineDetails,
  deleteMachine,
  getMachineHints,
  submitFlagMachine,
  getInactiveMachines,
  getActiveMachines,
  getMachineStatus,
  activateMachine,
  deactivateMachine,
  getActiveMachineDetails,
  getInactiveMachineDetails,
  getMachineReviews,
  deleteMachineReview,
  updateMachineReview,
  postMachineReview,
  deleteMachineReviewForce,
  getMachineReview,
  getMachineRating,
} from '../controllers/MachineController.js';

const MachineRoutes = express.Router();

// Public Routes
// Route to create a new machine
MachineRoutes.post('/', validateMachine, verifyToken, createMachine);

// Route to get active machine details by ID
MachineRoutes.get('/active/:machineId', verifyToken, getActiveMachineDetails);

// Route to get machine hints
MachineRoutes.get('/:machineId/hints', verifyToken, getMachineHints);

// Route to submit flag for a machine
MachineRoutes.post('/:machineId/submit-flag', verifyToken, flagSubmissionLimiter, submitFlagMachine);

// Route to get active machines
MachineRoutes.get('/active', verifyToken, getActiveMachines);

// Route to get machine reviews
MachineRoutes.get('/:machineId/reviews', verifyToken, getMachineReviews);

// Route to create a machine review
MachineRoutes.post('/:machineId/reviews', verifyToken, postMachineReview);

// Route to delete a machine review
MachineRoutes.delete('/:machineId/reviews/:reviewId', verifyToken, deleteMachineReview);

// Route to update a machine review by review ID
MachineRoutes.put('/:machineId/reviews/:reviewId', verifyToken, updateMachineReview);

// Route to get machine review by review ID
MachineRoutes.get('/:machineId/reviews/:reviewId', verifyToken, getMachineReview);

// Route to get machine rating
MachineRoutes.get('/:machineId/rating', verifyToken, getMachineRating);

// Admin Routes
// Route to get all machines(Admin only)
MachineRoutes.get('/', verifyToken, verifyAdmin, getAllMachines);

// Route to get inactive machine details by ID(Admin only)
MachineRoutes.get('/inactive/:machineId', verifyToken, verifyAdmin, getInactiveMachineDetails);

// Route to get a single machine details by ID(Admin only)
MachineRoutes.get('/:machineId', verifyToken, verifyAdmin, getMachineDetails);

// Route to update a machine details by ID(Admin only)
MachineRoutes.put('/:machineId', validateMachine, verifyToken, verifyAdmin, updateMachineDetails);

// Route to delete a machine by ID(Admin only)
MachineRoutes.delete('/:machineId', verifyToken, verifyAdmin, deleteMachine);

// Route to get inactive machines(Admin only)
MachineRoutes.get('/inactive', verifyToken, verifyAdmin, getInactiveMachines);

// Route to activate machine(Admin only)
MachineRoutes.post('/:machineId/active', verifyToken, verifyAdmin, activateMachine);

// Route to deactivate machine(Admin only)
MachineRoutes.post('/:machineId/deactive', verifyToken, verifyAdmin, deactivateMachine);

// Route to get machine status(Admin only)
MachineRoutes.get('/:machineId/status', verifyToken, verifyAdmin, getMachineStatus);

// Route to delete machine review forcefully(Admin only)
MachineRoutes.delete('/:machineId/reviews/:reviewId', verifyToken, verifyAdmin, deleteMachineReviewForce);

export default MachineRoutes;