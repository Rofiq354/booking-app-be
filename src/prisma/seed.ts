import { PrismaClient, BookingStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

function getDateThisWeek(dayOffset: number, hour: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  console.log("🌱 Starting seed...");

  // ─── Clean up ───────────────────────────────────────────────
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.field.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ──────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin Sportify",
        email: "admin@sportify.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "Budi Santoso",
        email: "budi@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Siti Rahayu",
        email: "siti@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Andi Wijaya",
        email: "andi@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Dewi Lestari",
        email: "dewi@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Rizky Pratama",
        email: "rizky@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Mega Putri",
        email: "mega@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Fajar Nugroho",
        email: "fajar@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Laila Fitriani",
        email: "laila@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Hendra Kusuma",
        email: "hendra@example.com",
        password: hashedPassword,
        role: "USER",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // ─── Fields (Futsal only) ────────────────────────────────────
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: "Lapangan Futsal A",
        description:
          "Lapangan futsal indoor dengan lantai vinyl premium anti-slip. Dilengkapi AC dan tribun penonton.",
        price: 150000,
        image: "https://example.com/images/futsal-a.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Lapangan Futsal B",
        description:
          "Lapangan futsal indoor dengan pencahayaan LED terang. Cocok untuk latihan malam hari.",
        price: 150000,
        image: "https://example.com/images/futsal-b.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Lapangan Futsal C",
        description:
          "Lapangan futsal standar FIFA dengan rumput sintetis berkualitas tinggi dan garis yang jelas.",
        price: 175000,
        image: "https://example.com/images/futsal-c.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Lapangan Futsal D",
        description:
          "Lapangan futsal VIP dengan fasilitas loker, shower, dan area tunggu ber-AC.",
        price: 200000,
        image: "https://example.com/images/futsal-d.jpg",
      },
    }),
    prisma.field.create({
      data: {
        name: "Lapangan Futsal E",
        description:
          "Lapangan futsal outdoor dengan atap kanopi anti-hujan, lantai beton halus, dan lampu sorot.",
        price: 125000,
        image: "https://example.com/images/futsal-e.jpg",
      },
    }),
  ]);

  console.log(`✅ Created ${fields.length} futsal fields`);

  // ─── Time Slots (7 hari ke depan, jam 07:00 – 22:00) ────────
  // Setiap field: 15 slot/hari × 7 hari = 105 slot per field
  const operationalHours = [
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

  const allSlots: { fieldId: number; startTime: Date; endTime: Date }[] = [];

  for (const field of fields) {
    for (let day = 0; day <= 6; day++) {
      for (const hour of operationalHours) {
        allSlots.push({
          fieldId: field.id,
          startTime: getDateThisWeek(day, hour),
          endTime: getDateThisWeek(day, hour + 1),
        });
      }
    }
  }

  await prisma.timeSlot.createMany({ data: allSlots });
  const createdSlots = await prisma.timeSlot.findMany();
  console.log(
    `✅ Created ${createdSlots.length} time slots (${fields.length} fields × 7 days × 15 slots)`,
  );

  // ─── Bookings ────────────────────────────────────────────────
  const regularUsers = users.filter((u) => u.role === "USER");

  const usedSlotIds = new Set<number>();

  const bookingData: {
    userId: number;
    fieldId: number;
    slotId: number;
    status: BookingStatus;
  }[] = [];

  const statuses: BookingStatus[] = [
    BookingStatus.CONFIRMED,
    BookingStatus.CONFIRMED,
    BookingStatus.CONFIRMED,
    BookingStatus.PENDING,
    BookingStatus.PENDING,
    BookingStatus.CANCELLED,
  ];

  let statusIndex = 0;

  // Tiap user booking di tiap field, ambil 3 slot berbeda (pagi, siang, malam)
  for (const user of regularUsers) {
    for (const field of fields) {
      const fieldSlots = createdSlots.filter(
        (s) => s.fieldId === field.id && !usedSlotIds.has(s.id),
      );
      if (fieldSlots.length < 3) continue;

      const picks = [
        fieldSlots[0], // pagi
        fieldSlots[Math.floor(fieldSlots.length * 0.4)], // siang
        fieldSlots[Math.floor(fieldSlots.length * 0.75)], // malam
      ];

      for (const slot of picks) {
        if (usedSlotIds.has(slot.id)) continue;
        usedSlotIds.add(slot.id);

        bookingData.push({
          userId: user.id,
          fieldId: field.id,
          slotId: slot.id,
          status: statuses[statusIndex % statuses.length],
        });
        statusIndex++;
      }
    }
  }

  const createdBookings: {
    id: number;
    userId: number;
    fieldId: number;
    status: BookingStatus;
  }[] = [];

  for (const data of bookingData) {
    const booking = await prisma.booking.create({ data });
    createdBookings.push(booking);
  }

  console.log(`✅ Created ${createdBookings.length} bookings`);

  // ─── Reviews ─────────────────────────────────────────────────
  const reviewComments = [
    "Lapangan bersih dan terawat, pasti balik lagi!",
    "Pelayanan ramah, fasilitas lengkap. Sangat memuaskan.",
    "Harga terjangkau untuk kualitas lapangan yang bagus.",
    "Pencahayaan cukup terang, nyaman main malam hari.",
    "Parkir luas, loker tersedia. Recommended banget!",
    "Lantai tidak licin, aman untuk bermain intensif.",
    "AC dingin, suasana nyaman. Worth it!",
    "Mudah booking, konfirmasi cepat. Mantap!",
    "Lapangan sesuai foto, tidak mengecewakan.",
    "Staff friendly dan responsif. Akan booking lagi.",
    "Lokasi strategis, gampang dijangkau dari mana-mana.",
    "Gawang kokoh, jaring masih bagus. Enak mainnya!",
    "Shower bersih dan air panas tersedia. Nyaman!",
    "Sesuai ekspektasi, harga sebanding dengan kualitas.",
    "Arena indoor bersih, tidak bau. Nilai plus!",
    "Lapangan luas, marking garis sangat jelas.",
    "Bola disediakan gratis, lumayan hemat!",
    "Tempat duduk tersedia untuk yang menunggu.",
    "Sistem booking online sangat memudahkan.",
    "Tidak pernah kecewa pesan di sini. Top!",
  ];

  const confirmedBookings = createdBookings.filter(
    (b) => b.status === BookingStatus.CONFIRMED,
  );

  let reviewCount = 0;
  for (let i = 0; i < confirmedBookings.length; i++) {
    const booking = confirmedBookings[i];
    const rating = Math.random() > 0.3 ? 5 : 4; // 70% bintang 5, 30% bintang 4
    const comment = reviewComments[i % reviewComments.length];

    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: booking.userId,
        fieldId: booking.fieldId,
        bookingId: booking.id,
      },
    });
    reviewCount++;
  }

  console.log(`✅ Created ${reviewCount} reviews`);

  // ─── Summary ─────────────────────────────────────────────────
  console.log("\n📊 Seed Summary:");
  console.log(
    `   👤 Users     : ${users.length} (1 admin + ${regularUsers.length} user)`,
  );
  console.log(`   🏟️  Fields    : ${fields.length} (futsal only)`);
  console.log(`   🕐 TimeSlots : ${createdSlots.length}`);
  console.log(`   📅 Bookings  : ${createdBookings.length}`);
  console.log(`   ⭐ Reviews   : ${reviewCount}`);
  console.log("\n🔑 Admin credentials:");
  console.log("   Email    : admin@sportify.com");
  console.log("   Password : password123");
  console.log("\n🔑 User credentials (semua sama):");
  console.log("   Password : password123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n✨ Seed completed successfully!");
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
