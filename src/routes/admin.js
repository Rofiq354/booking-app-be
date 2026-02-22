"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const authAdmin_1 = require("../middlewares/authAdmin");
const user_auth_1 = require("../controllers/user-auth");
const time_slots_1 = require("../controllers/time-slots");
const field_1 = require("../controllers/field");
const booking_1 = require("../controllers/booking");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
router.get("/admin", auth_1.authenticate, authAdmin_1.isAdmin, user_auth_1.handleGetAdmins);
router.post("/create", auth_1.authenticate, authAdmin_1.isAdmin, user_auth_1.handleCreateAdmin);
// field
router.post("/field", auth_1.authenticate, authAdmin_1.isAdmin, upload_1.default.single("image"), field_1.handleCreateField);
router.put("/field/:id", auth_1.authenticate, authAdmin_1.isAdmin, upload_1.default.single("image"), field_1.updateField);
router.delete("/field/:id", auth_1.authenticate, authAdmin_1.isAdmin, field_1.deleteField);
// time
router.post("/timeslot/:fieldId", auth_1.authenticate, authAdmin_1.isAdmin, time_slots_1.createSlotsController);
// booking
router.get("/user-pending", auth_1.authenticate, authAdmin_1.isAdmin, booking_1.getAllUserPending);
router.get("/booking", auth_1.authenticate, authAdmin_1.isAdmin, booking_1.getAllBooking);
router.patch("/booking/:id/approve", auth_1.authenticate, authAdmin_1.isAdmin, booking_1.approveBooking);
router.patch("/booking/:id/cancel", auth_1.authenticate, authAdmin_1.isAdmin, booking_1.rejectBooking);
exports.default = router;
