import { Pool } from "pg"

export const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

db.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error on idle client:", err);
});

