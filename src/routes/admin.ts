import express from "express";
import { authenticate } from "../middlewares/auth";
import { isAdmin } from "../middlewares/authAdmin";
import { handleCreateAdmin } from "../controllers/user-auth";

const router = express.Router();

router.post("/admin/create", authenticate, isAdmin, handleCreateAdmin);

export default router;
