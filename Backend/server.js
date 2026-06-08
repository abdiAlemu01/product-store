// server.js
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import { attachCurrentUser } from "./middleware/authMiddleware.js";
import { runMigrations } from "./config/migrations.js";

dotenv.config();
const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 3000;
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://product-store-pied.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false, // Allow images to be loaded cross-origin
  })
);
app.use(morgan("dev"));

// Images are now stored on Cloudinary CDN — no local /uploads/ static serving needed

// Arcjet rate-limiting / bot-protection middleware
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use(attachCurrentUser);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME || "System Admin";
  const adminPhone = process.env.ADMIN_PHONE || "+251900000000";
  const adminUsername = process.env.ADMIN_USERNAME || "system-admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  await sql`
    INSERT INTO users (username, full_name, phone_number, password, role)
    VALUES (${adminUsername}, ${adminName}, ${adminPhone}, ${hashedAdminPassword}, 'admin')
    ON CONFLICT (phone_number) DO NOTHING
  `;

  console.log("Database initialized successfully");
  console.log(`Default admin phone: ${adminPhone}`);
}

async function initDB() {
  try {
    await runMigrations();
    await seedAdmin();
  } catch (error) {
    console.log("Error initDB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
