export async function registrarUsuario(nombreUser, correoUser, contra) {
  try {
    const response = await fetch("/api/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombreUser, correoUser, contra }),
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const result = await response.json();
    console.log("Datos insertados: ", result);
    return result;
  } catch (error) {
    console.error("Error al insertar datos:", error);
    throw error;
  }
}
