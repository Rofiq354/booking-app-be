import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleLoginUser,
  handleRegisterUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";
import { createBooking, userCancelBooking } from "../controllers/booking";
import { isUser } from "../middlewares/authUser";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);
router.get("/me", authenticate, userLogin);
router.post("/user/logout", authenticate, userLogout);

// booking
router.post("/booking", authenticate, isUser, createBooking);
router.patch("/booking/:id/cancel", authenticate, isUser, userCancelBooking);

export default router;
