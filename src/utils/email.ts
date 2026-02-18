import nodemailer from "nodemailer";
import "dotenv/config";
import { AppError } from "../errors/AppError";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const createEmail = (
  email: string,
  fieldName: string,
  startTime: Date,
  endTime: Date,
  price: number,
) => ({
  from: process.env.MAIL_USER,
  to: email,
  subject: "Konfirmasi Booking Lapangan Futsal",
  html: `
    <h2>Booking Berhasil </h2>
    <p>Lapangan: ${fieldName}</p>
    <p>Tanggal: ${startTime.toLocaleDateString("id-ID")}</p>
    <p>Waktu: ${startTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
    <p>Total: Rp ${price.toLocaleString("id-ID")}</p>
  `,
});

export const sendEmail = async (
  email: string,
  fieldName: string,
  startTime: Date,
  endTime: Date,
  price: number,
) => {
  return transporter.sendMail(
    createEmail(email, fieldName, startTime, endTime, price),
  );
};
