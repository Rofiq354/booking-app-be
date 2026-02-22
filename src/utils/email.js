"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.createEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
const createEmail = (email, fieldName, startTime, endTime, price) => {
    // 1. Format data untuk isi pesan WhatsApp
    const tgl = startTime.toLocaleDateString("id-ID");
    const jam = `${startTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    const total = `Rp ${price.toLocaleString("id-ID")}`;
    const waText = `Halo Admin FutsalHub, saya ingin konfirmasi booking:
Nama Lapangan: ${fieldName}
Tanggal: ${tgl}
Waktu: ${jam}
Total: ${total}

Mohon diproses, terima kasih.`;
    // 2. Encode teks agar aman masuk ke link URL
    const encodedWaText = encodeURIComponent(waText);
    const waNumber = "6285860310399";
    const waLink = `https://wa.me/${waNumber}?text=${encodedWaText}`;
    return {
        from: `"FutsalHub" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Konfirmasi Booking Lapangan Futsal",
        html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Booking Berhasil!</h2>
        <p>Detail pesanan Anda:</p>
        <table style="width: 100%; max-width: 400px; border-collapse: collapse;">
          <tr><td><b>Lapangan</b></td><td>: ${fieldName}</td></tr>
          <tr><td><b>Tanggal</b></td><td>: ${tgl}</td></tr>
          <tr><td><b>Waktu</b></td><td>: ${jam}</td></tr>
          <tr><td><b>Total</b></td><td>: <b>${total}</b></td></tr>
        </table>
        
        <p>Untuk menyelesaikan pembayaran, silakan klik tombol di bawah ini untuk konfirmasi ke WhatsApp Admin:</p>
        
        <a href="${waLink}" 
           style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
           Konfirmasi via WhatsApp
        </a>
      </div>
    `,
    };
};
exports.createEmail = createEmail;
const sendEmail = (email, fieldName, startTime, endTime, price) => __awaiter(void 0, void 0, void 0, function* () {
    return transporter.sendMail((0, exports.createEmail)(email, fieldName, startTime, endTime, price));
});
exports.sendEmail = sendEmail;
