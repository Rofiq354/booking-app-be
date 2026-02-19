import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleLoginUser,
  handleRegisterUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";
import {
  createBooking,
  getUserBooking,
  userCancelBooking,
} from "../controllers/booking";
import { isUser } from "../middlewares/authUser";
import { getAllField, getDetailField } from "../controllers/field";
import { getSlotsController } from "../controllers/time-slots";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);
router.get("/me", authenticate, userLogin);
router.post("/user/logout", authenticate, userLogout);

// booking
router.get("/booking/userBookings", authenticate, getUserBooking);
router.post("/booking", authenticate, isUser, createBooking);
router.patch("/booking/:id/cancel", authenticate, isUser, userCancelBooking);

//field
router.get("/field", authenticate, getAllField);
router.get("/field/:id", authenticate, getDetailField);

//time
router.get("/timeslot/:fieldId", authenticate, getSlotsController);

export default router;
