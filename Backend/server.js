// server.js
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

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
app.use("/api/products", productRoutes);
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDB", error);
  }
}
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});






