import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const con = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "280404",
  database: process.env.DB_NAME || "emp"
});

con.connect(function(err) {
  if (err) {
    console.log("connection error", err);
  } else {
    console.log("connected");
  }
});

export default con; 
