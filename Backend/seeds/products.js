import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 159.99,
  },
  {
    name: "Smart Watch Pro",
    price: 249.99,
  },
  {
    name: "4K Ultra HD Camera",
    price: 899.99,
  },
  {
    name: "Minimalist Backpack",
    price: 79.99,
  },
  {
    name: "Wireless Gaming Mouse",
    price: 89.99,
  },
  {
    name: "Smart Home Speaker",
    price: 159.99,
  },
  {
    name: "LED Gaming Monitor",
    price: 449.99,
  },
];

async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE products RESTART IDENTITY`;

    // insert all products without images
    for (const product of SAMPLE_PRODUCTS) {
      await sql`
        INSERT INTO products (name, price)
        VALUES (${product.name}, ${product.price})
      `;
    }

    console.log("Database seeded successfully (without images)");
    console.log("Please upload images for products through the admin panel");
    process.exit(0); // success code
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // failure code
  }
}

seedDatabase();