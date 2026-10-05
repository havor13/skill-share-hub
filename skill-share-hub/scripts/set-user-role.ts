/**
 * One-off script: promotes (or demotes) a user's role.
 *
 * Usage:
 *   npx tsx scripts/set-user-role.ts ava@example.com admin
 *   npx tsx scripts/set-user-role.ts ava@example.com user
 *
 * There is intentionally no API endpoint or UI for this — granting admin
 * access should never be self-service. Run this manually, as the project
 * owner, against the database.
 */
import mongoose from "mongoose";
import "dotenv/config";
import User, { USER_ROLES, type UserRole } from "../models/User";

async function main() {
  const [, , email, role] = process.argv;

  if (!email || !role || !USER_ROLES.includes(role as UserRole)) {
    console.error(
      `Usage: npx tsx scripts/set-user-role.ts <email> <${USER_ROLES.join("|")}>`
    );
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in your .env.local / .env");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { role } },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email ${email}`);
  } else {
    console.log(`${user.email} is now role: ${user.role}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});