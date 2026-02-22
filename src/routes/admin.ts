import express from "express";
import { authenticate } from "../middlewares/auth";
import { isAdmin } from "../middlewares/authAdmin";
import { handleCreateAdmin, handleGetAdmins } from "../controllers/user-auth";
import {
  createSlotsController,
  getSlotsController,
} from "../controllers/time-slots";
import {
  deleteField,
  getAllField,
  handleCreateField,
  updateField,
} from "../controllers/field";
import {
  approveBooking,
  getAllBooking,
  getAllUserPending,
  rejectBooking,
} from "../controllers/booking";
import upload from "../middlewares/upload";

const router = express.Router();

router.get("/admin", authenticate, isAdmin, handleGetAdmins);
router.post("/create", authenticate, isAdmin, handleCreateAdmin);
// field
router.post(
  "/field",
  authenticate,
  isAdmin,
  upload.single("image"),
  handleCreateField,
);

router.put(
  "/field/:id",
  authenticate,
  isAdmin,
  upload.single("image"),
  updateField,
);
router.delete("/field/:id", authenticate, isAdmin, deleteField);

// time
router.post("/timeslot/:fieldId", authenticate, isAdmin, createSlotsController);

// booking
router.get("/user-pending", authenticate, isAdmin, getAllUserPending);
router.get("/booking", authenticate, isAdmin, getAllBooking);
router.patch("/booking/:id/approve", authenticate, isAdmin, approveBooking);
router.patch("/booking/:id/cancel", authenticate, isAdmin, rejectBooking);

export default router;
