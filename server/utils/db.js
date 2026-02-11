import mysql from 'mysql2';

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "280404",
  database: "emp"
});

con.connect(function(err) {
  if (err) {
    console.log("connection error");
  } else {
    console.log("connected");
  }
});

export default con; 
