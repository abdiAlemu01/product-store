// db.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
const {PGHOST, PGDATABASE, PGUSER,PGPASSWORD}=process.env;
// create a sql connection using our env variables
export const sql= neon(
     `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)
// this sql function we export is used as a tagged template literal,which allows us to write sql queries safely

// postgresql://neondb_owner:npg_uIkbo6M7tVPJ@ep-quiet-heart-a4aciu2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require