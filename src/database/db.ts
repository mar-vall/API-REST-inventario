import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

export async function connectDB() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
