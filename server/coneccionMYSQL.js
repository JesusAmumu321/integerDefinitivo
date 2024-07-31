import mysql from 'mysql2/promise';

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Lavozdormida17',
      database: 'prueba',
      port: 3306
    });

    console.log("\n");
    console.log('Conexion a MySQL establecida.');
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
};

export default connect;