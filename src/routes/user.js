"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const user_auth_1 = require("../controllers/user-auth");
const booking_1 = require("../controllers/booking");
const authUser_1 = require("../middlewares/authUser");
const field_1 = require("../controllers/field");
const time_slots_1 = require("../controllers/time-slots");
const rating_1 = require("../controllers/rating");
const stats_1 = require("../controllers/stats");
const router = express_1.default.Router();
router.post("/user/register", user_auth_1.handleRegisterUser);
router.post("/user/login", user_auth_1.handleLoginUser);
router.get("/me", auth_1.authenticate, user_auth_1.userLogin);
router.post("/user/logout", auth_1.authenticate, user_auth_1.userLogout);
// booking
router.get("/detail-booking", auth_1.authenticate, booking_1.getUserBooking);
router.post("/booking", auth_1.authenticate, authUser_1.isUser, booking_1.createBooking);
router.patch("/booking/:id/cancel", auth_1.authenticate, authUser_1.isUser, booking_1.userCancelBooking);
//field
router.get("/field", field_1.getAllField);
router.get("/field/:id", field_1.getDetailField);
//time
router.get("/timeslot/:fieldId", time_slots_1.getSlotsController);
//rating
router.post("/review", auth_1.authenticate, rating_1.createReview);
// Hero Stats
router.get("/stats/hero", stats_1.getHeroStats);
exports.default = router;
