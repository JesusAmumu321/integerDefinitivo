import express from "express";
import { PORT } from "./config.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connect from "./coneccionMYSQL.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// middleware son funciones q se ejecutan antes q lleguen a las peticiones, pq por defeccto, express no
// tramita el cuerpo del formulario cuando se lo enviamos como JSON.
app.use(cors());

// pasa la peticion por aqui, la trata y hace q en los endpoints se tenga algun tipo de validacion, etc.
// express.json().
// mira si la req tiene algo en el body como un post (por ejemplo), y en este tiene un JSON y lo transforma.
app.use(express.json());

app.use(express.static(join(__dirname, "../public")));
// ---------------

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../public/HTML/index.html"), (err) => {
    if (err) {
      console.error("error encontrando el archivo:", err);
      res.status(500).end(); // el 500 indica que hubo una condicion inesperada, un error
    }
  });
});

app.get("/registro", (req, res) => {
  res.sendFile(join(__dirname, "../public/HTML/registro.html"), (err) => {
    if (err) {
      console.error("error encontrando el archivo:", err);
      res.status(500).end(); // el 500 indica que hubo una condicion inesperada, un error
    }
  });
});

app.post("/api/verificar-correo", async (req, res) => {
  const { correo } = req.body; // body es le cuerpo de la peticion, el cual va a contener el correo

  try {
    const db = await connect();
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);
    await db.end();

    res.json({ existe: rows.length > 0 });
  } catch (error) {
    // aqui se pueden poner if y cosas asi para manejar bien los errores y no tener un despapaye
    console.error("Error al verificar el correo:", error.message);

    res.status(500).json({ mensaje: "Error al verificar el correo" }); // el 500 indica que hubo una condicion inesperada, un error
  }
});

app.post("/api/registrar", async (req, res) => {
  const { usuario, correo, contrasena } = req.body;

  try {
    const db = await connect();
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)",
      [usuario, correo, contrasena]
    );

    await db.end();
    res
      .status(200)
      .json({ success: true, message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error al insertar datos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar usuario" }); // el 500 indica que hubo una condicion inesperada, un error
  }
});

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "../public/HTML/login.html"), (err) => {
    if (err) {
      console.error("error encontrando el archivo:", err);
      res.status(500).end();
    }
  });
});

app.post("/api/iniciar", async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const db = await connect();
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);
    await db.end();

    if (rows.length > 0) {
      const user = rows[0];

      if (user.contrasena === contrasena) {
        const userId = await obtenerUserId(correo);
        res.json({
          autenticado: true,
          mensaje: "Inicio de sesión exitoso",
          userId,
        });
      } else {
        res
          .status(400)
          .json({ autenticado: false, mensaje: "Contraseña incorrecta" });
      }
    } else {
      res
        .status(401)
        .json({ autenticado: false, mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      autenticado: false,
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
});

async function obtenerUserId(correo) {
  try {
    const db = await connect();
    const [rows] = await db.execute(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );
    await db.end();

    if (rows.length > 0) {
      return rows[0].id_usuario;
    } else {
      throw new Error("No se encontró ningún usuario con ese correo.");
    }
  } catch (error) {
    console.error("Error al obtener el ID del usuario:", error);
    throw error;
  }
}

app.post("/api/agregar-medicamento", async (req, res) => {
  const userId = req.headers["user-id"];
  const {
    tipo_medicamento,
    frecuenciaToma,
    nombreMed,
    cantidadDosis,
    cantidadUnaCaja,
    cantidadCajas,
    caducidadMed,
    ultimaToma,
  } = req.body;

  if (!tipo_medicamento || !nombreMed || !cantidadDosis || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const db = await connect();
    const [result] = await db.execute(
      "INSERT INTO medicamento (tipo_medicamento, frecuenciaToma, nombreMed, cantidadDosis, cantidadUnaCaja, cantidadCajas, caducidadMed, ultimaToma, Pk_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tipo_medicamento,
        frecuenciaToma || null,
        nombreMed,
        cantidadDosis,
        cantidadUnaCaja || null,
        cantidadCajas || null,
        caducidadMed || null,
        ultimaToma || null,
        userId,
      ]
    );
    await db.end();

    res
      .status(200)
      .json({ success: true, message: "Medicamento agregado con éxito" });
  } catch (error) {
    console.error("Error al insertar medicamento:", error);
    res.status(500).json({
      success: false,
      message: "Error al agregar medicamento",
      error: error.message,
    });
  }
});

app.get("/getMedicamentos", async (req, res) => {
  const userId = req.headers["user-id"];
  try {
    console.log("Intentando obtener medicamentos");
    const db = await connect();
    console.log("Conexión a la base de datos establecida");
    const [rows] = await db.execute(
      `
      SELECT 
        nombreMed, 
        caducidadMed, 
        cantidadUnaCaja, 
        cantidadDosis, 
        ultimaToma, 
        frecuenciaToma
      FROM medicamento
      Where Pk_Usuario = ?
    `,
      [userId]
    );

    await db.end();
    res.json(rows);
  } catch (error) {
    console.error("Error detallado al obtener medicamentos:", error);
    res
      .status(500)
      .json({ message: "Error al obtener medicamentos", error: error.message });
  }
});

app.get("/getEventosMedicamentos", async (req, res) => {
  const userId = req.headers["user-id"];
  try {
    const db = await connect();
    const [rows] = await db.execute(`
      SELECT e.id_evento, e.titulo, e.fecha_hora, m.id_medicamento
      FROM eventos e
      JOIN medicamento m ON e.id_medicamento = m.id_medicamento
      WHERE m.Pk_Usuario = ?
      ORDER BY e.fecha_hora
    `, [userId]);
    await db.end();
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener eventos de medicamentos:", error);
    res.status(500).json({ message: "Error al obtener eventos de medicamentos", error: error.message });
  }
});

app.post("/borrarEvento", async (req, res) => {
  const userId = req.headers["user-id"];
  const { idEvento, idMedicamento } = req.body;

  try {
    const db = await connect();
    await db.execute(`
      DELETE FROM eventos 
      WHERE id_evento = ? AND id_medicamento IN (
        SELECT id_medicamento FROM medicamento WHERE Pk_Usuario = ?
    `, [idEvento, userId]);
    await db.end();
    res.json({ success: true, message: "Evento borrado con éxito" });
  } catch (error) {
    console.error("Error al borrar evento:", error);
    res.status(500).json({ success: false, message: "Error al borrar evento", error: error.message });
  }
});



app.post("/api/agregar-contacto", async (req, res) => {
  const { usuario, correo, razon_contacto, detalles, como_nos_ubico } = req.body;

  // Verificar campos obligatorios
  if (!usuario || !correo || !razon_contacto || !detalles || !como_nos_ubico) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const db = await connect();
    // Primero, intentamos obtener el id_usuario basado en el correo
    const [userRows] = await db.execute("SELECT id_usuario FROM usuarios WHERE correo = ?", [correo]);
    let id_usuario = null;
    if (userRows.length > 0) {
      id_usuario = userRows[0].id_usuario;
    }

    // Insertamos el contacto
    const [result] = await db.execute(
      "INSERT INTO contactos (id_usuario, correo, razon_contacto, detalles, como_nos_ubico) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, correo, razon_contacto, detalles, como_nos_ubico]
    );

    await db.end();

    res.status(200).json({ success: true, message: "Contacto registrado con éxito" });
  } catch (error) {
    console.error("Error al insertar contacto:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar contacto",
      error: error.message,
    });
  }
});