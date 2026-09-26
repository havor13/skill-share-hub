/**
 * One-off script: sets a bcrypt-hashed password on an existing user so you can
 * log in and test the authenticated tutorial endpoints.
 *
 * Usage:
 *   npx tsx scripts/set-test-password.ts ava@example.com mypassword123
 *
 * (If you don't have tsx: npm install -D tsx)
 *
 * Delete this file once you have a real signup flow — it's a testing shortcut,
 * not something to ship.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "../models/User";

async function main() {
  const [, , email, plainPassword] = process.argv;

  if (!email || !plainPassword) {
    console.error("Usage: npx tsx scripts/set-test-password.ts <email> <password>");
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in your .env.local / .env");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { passwordHash } },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email ${email}`);
  } else {
    console.log(`Password set for ${user.email}. You can now log in with:`);
    console.log(`  email:    ${user.email}`);
    console.log(`  password: ${plainPassword}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});