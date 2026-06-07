import dotenv from "dotenv";
import { runMigrations } from "../config/migrations.js";

dotenv.config();

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
