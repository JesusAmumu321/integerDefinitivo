// import { createPool } from "mysql2/promise";

// export const pool = createPool({
//   host: "localhost",
//   port: 3306,
//   database: "prueba",
//   user: "root",
//   password: "root",
// });

import mysql from 'mysql2/promise';

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tencachi99',
      database: 'prueba',
      port: 3306
    });
    console.log('Conexion a MySQL establecida.');
    return connection;
  } catch (error) {
    console.log("\n");
    console.log("----------------------------------");
    console.error("Error al conectar con MYSQL:", error);
    console.log("----------------------------------");
    console.log("\n");
    throw error;
  }
};

export default connect;