import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const name = process.env.STUDENT_NAME?.trim();
const email = process.env.STUDENT_EMAIL?.trim().toLowerCase();
const password = process.env.STUDENT_PASSWORD;

if (!name || name.length > 100) {
  throw new Error("STUDENT_NAME must contain 1-100 characters.");
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("STUDENT_EMAIL must be a valid email address.");
}
if (!password || password.length < 12) {
  throw new Error("STUDENT_PASSWORD must be at least 12 characters.");
}

const prisma = new PrismaClient();

try {
  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 12),
    },
  });
  console.log(`Student account created for ${email}.`);
} catch (error) {
  console.error("Could not create student account:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
