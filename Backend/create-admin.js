import { sql } from "./config/db.js";
import bcrypt from "bcrypt";

async function createAdmin() {
  try {
    const phoneNumber = "+251974658033";
    const password = "123@chare74658033";
    const fullName = "Chare Tesfaye";
    const username = "admin-user";
    const role = "admin";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id, phone_number
      FROM users
      WHERE phone_number = ${phoneNumber}
      LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      console.log("Admin with this phone number already exists.");
      console.log("Updating password for existing admin...");

      // Update the existing admin's password
      await sql`
        UPDATE users
        SET password = ${hashedPassword}
        WHERE phone_number = ${phoneNumber}
      `;

      console.log("Admin password updated successfully.");
    } else {
      // Create new admin
      const createdAdmin = await sql`
        INSERT INTO users (username, full_name, phone_number, password, role)
        VALUES (${username}, ${fullName}, ${phoneNumber}, ${hashedPassword}, ${role})
        RETURNING id, full_name, phone_number, role
      `;

      console.log("Admin created successfully:");
      console.log({
        id: createdAdmin[0].id,
        full_name: createdAdmin[0].full_name,
        phone_number: createdAdmin[0].phone_number,
        role: createdAdmin[0].role,
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
