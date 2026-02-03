import express from "express";
import { authenticate } from "../middlewares/auth";
import { handleLoginUser, handleRegisterUser } from "../controllers/user-auth";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);

export default router;
