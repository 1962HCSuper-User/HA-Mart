import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { pool } from "./db.js";
dotenv.config();


/**
* Run: npm run seed
* This inserts a demo user with username "demo", password "Pass@123", code "123456".
* Update values as you like.
*/
async function main() {
const username = "demo";
const email = "you@example.com"; // <-- put your real email to receive the link
const password = "Pass@123";
const code = "123456"; // per-user login code required on the form


const hash = await bcrypt.hash(password, 10);


await pool.query(
"INSERT INTO users (username, email, password_hash, login_code) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash), login_code=VALUES(login_code)",
[username, email, hash, code]
);


console.log("✅ Seeded user:", { username, email, password, code });
process.exit(0);
}


main().catch((e) => { console.error(e); process.exit(1); });