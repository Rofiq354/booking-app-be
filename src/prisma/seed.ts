import { prisma } from "./client";
import bcrypt from "bcrypt";

export const main = async () => {
  const adminEmail = "admin1@gmail.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("email sudah terdaftar");
    return;
  }

  const hashed = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Pertama",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
  });
};

main()
  .then(() => {
    console.log("seeding completed");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
