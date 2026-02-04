import express from "express";
import { authenticate } from "../middlewares/auth";
import { isAdmin } from "../middlewares/authAdmin";
import { handleCreateAdmin } from "../controllers/user-auth";
import {
  createSlotsController,
  getSlotsController,
} from "../controllers/time-slots";
import {
  getAllField,
  handleCreateField,
  updateField,
} from "../controllers/field";

const router = express.Router();

router.post("/admin/create", authenticate, isAdmin, handleCreateAdmin);
// field
router.post("/field", authenticate, isAdmin, handleCreateField);
router.get("/field", authenticate, isAdmin, getAllField);
router.patch("/field/:id", authenticate, isAdmin, updateField);

// time
router.post("/timeslot/:fieldId", authenticate, isAdmin, createSlotsController);
router.get("/timeslot/:fieldId", authenticate, isAdmin, getSlotsController);

export default router;
