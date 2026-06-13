import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
console.log("DATABASE_URL:", process.env.DATABASE_URL);
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection on startup
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL");
    console.error(err);
  });