import { sql } from "./db.js";

async function runStep(name, query) {
  try {
    await query();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ⚠ ${name}: ${error.message}`);
    return false;
  }
}

export async function runMigrations() {
  console.log("Running database migrations...");

  await runStep("products table", () => sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(500),
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("products.image column width", () => sql`
    ALTER TABLE products ALTER COLUMN image TYPE VARCHAR(500)
  `);

  await runStep("users table", () => sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(30) UNIQUE NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("users.username", () => sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255)
  `);
  await runStep("users.full_name", () => sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)
  `);
  await runStep("users.phone_number", () => sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30)
  `);
  await runStep("users.role", () => sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer'
  `);
  await runStep("users.created_at", () => sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `);
  await runStep("users.password type", () => sql`
    ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(255)
  `);
  await runStep("users phone index", () => sql`
    CREATE UNIQUE INDEX IF NOT EXISTS users_phone_number_idx ON users(phone_number)
  `);

  await runStep("orders table", () => sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
      status VARCHAR(30) NOT NULL DEFAULT 'Placed',
      total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("orders.customer_id", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `);
  await runStep("orders.product_id", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
  `);
  await runStep("orders.quantity", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1
  `);
  await runStep("orders.status", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Placed'
  `);
  await runStep("orders.total_amount", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0
  `);
  await runStep("orders.created_at", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `);
  await runStep("orders.custom_product_name", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS custom_product_name VARCHAR(255)
  `);
  await runStep("orders.is_custom", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE
  `);
  await runStep("orders.rejection_reason", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT
  `);
  await runStep("orders.reviewed_at", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP
  `);
  await runStep("orders.reviewed_by", () => sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);
  await runStep("orders.product_id nullable", () => sql`
    ALTER TABLE orders ALTER COLUMN product_id DROP NOT NULL
  `);

  await runStep("notifications table", () => sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT DEFAULT '',
      order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
      read_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("conversations table", () => sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("messages table", () => sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
      read_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runStep("promotions table", () => sql`
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
  `);

  await runStep("promotions.customer_id", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);
  await runStep("promotions.phone_number", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30)
  `);
  await runStep("promotions.title", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS title VARCHAR(255)
  `);
  await runStep("promotions.message", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS message TEXT DEFAULT ''
  `);
  await runStep("promotions.discount_percent", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5, 2) DEFAULT 0
  `);
  await runStep("promotions.created_by", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);
  await runStep("promotions.created_at", () => sql`
    ALTER TABLE promotions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `);

  console.log("Database migrations finished.");
}
