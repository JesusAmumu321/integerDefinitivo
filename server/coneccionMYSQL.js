import mysql from "mysql2/promise";

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: "srv1578.hstgr.io",
      user: "u589597310_jrodriguez",
      password: "fJM[$f&RW*8",
      database: "u589597310_integradora",
      port: 3306,
    });

    console.log("\n");
    console.log("Conexion a MySQL establecida.");
    console.log("\n");
    
    return connection;
  } catch (error) {
    console.log("\n");
    console.log("----------------------------------");
    console.error("Error al conectar con MYSQL:", error);
    console.log("----------------------------------");
    console.log("\n");
    throw error;
  }
}

export default connect;
