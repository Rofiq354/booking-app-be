import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userAuth from "./routes/user";
import adminAuth from "./routes/admin";
import { errorHandler } from "./errors/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    // 1. Ganti '*' menjadi origin yang spesifik
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.FRONTEND_URL!,
    ],

    // 2. Izinkan pengiriman cookie/credentials
    credentials: true,

    // 3. (Opsional) Tambahkan method yang diizinkan agar preflight tidak gagal
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", userAuth);
app.use("/api/admin", adminAuth);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
