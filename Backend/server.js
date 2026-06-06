// server.js
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import { attachCurrentUser } from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.set("trust proxy", true);
const PORT = process.env.PORT || 3000;
app.use(express.json());


const allowedOrigins = [
  "http://localhost:5173", 
  "https://product-store-pied.vercel.app" 
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false, // Allow images to be loaded cross-origin
  })
); 
app.use(morgan("dev")); 

// Serve static files from uploads directory BEFORE Arcjet middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.use(async (req, res, next) => {
  // Skip Arcjet for static file requests
  if (req.path.startsWith('/uploads')) {
    return next();
  }
  
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
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
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
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(30) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS username VARCHAR(255)
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30)
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer'
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;

    await sql`
      ALTER TABLE users
      ALTER COLUMN password TYPE VARCHAR(255)
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_phone_number_idx
      ON users(phone_number)
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
        status VARCHAR(30) NOT NULL DEFAULT 'Placed',
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Placed'
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0
    `;

    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        phone_number VARCHAR(30) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT DEFAULT '',
        discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30)
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS title VARCHAR(255)
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS message TEXT DEFAULT ''
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5, 2) DEFAULT 0
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    `;

    await sql`
      ALTER TABLE promotions
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;

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
  } catch (error) {
    console.log("Error initDB", error);
  }
}
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});






