import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleLoginUser,
  handleRegisterUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";
import { createBooking } from "../controllers/booking";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);
router.get("/me", authenticate, userLogin);
router.post("/user/logout", authenticate, userLogout);

// booking
router.post("/booking", authenticate, createBooking);

export default router;
