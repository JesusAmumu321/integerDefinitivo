// // Función para verificar la sesión
// async function verificarSesion() {
//   try {
//     const response = await fetch("/api/verificar-sesion");
//     const data = await response.json();
//     if (data.autenticado) {
//       window.location.href = "../HTML/agregarMed.html"; // Redirigir si la sesión es válida
//     }
//   } catch (error) {
//     console.error("Error al verificar la sesión:", error);
//   }
// }

// funcion para el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  if (!correo || !contrasena) {
    Swal.fire({
      icon: "warning",
      title:
        window.translations.errorMessages.camposVacios ||
        "Por favor, complete todos los campos.",
      allowOutsideClick: false,
    });
    return;
  }

  try {
    const response = await fetch("/api/iniciar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title:
          window.translations.alertTexts.alertaInicioExitoso ||
          "Inicio de sesión exitoso, redirigiendo...",
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(() => {
        window.location.href = "../HTML/agregarMed.html";
      });
    } else {
      let errorMessage =
        window.translations.errorMessages.errorServidor ||
        "Error en el servidor. Por favor, intente más tarde.";

      if (data.mensaje === "Usuario no encontrado") {
        errorMessage =
          window.translations.errorMessages.usuarioNoEncontrado ||
          "Usuario no encontrado";
      } else if (data.mensaje === "Contraseña incorrecta") {
        errorMessage =
          window.translations.errorMessages.contrasenaIncorrecta ||
          "Contraseña incorrecta";
      }

      Swal.fire({
        icon: "error",
        title:
          window.translations.alertTexts.alertaElseResponseOk ||
          "Error al iniciar sesión",
        text: errorMessage,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    console.error("Error durante el proceso de inicio de sesión.", error);
    Swal.fire({
      icon: "error",
      title:
        window.translations.alertTexts.alertaCatchInicioSesion ||
        "Error al iniciar sesión. Por favor, intente nuevamente.",
      text:
        window.translations.errorMessages.errorServidor ||
        "Error en el servidor. Por favor, intente más tarde.",
      allowOutsideClick: false,
    });
  }
}

// Función para manejar la expiración de sesión
function handleSessionExpiration(response) {
  if (response.status === 401) {
    return response.json().then((data) => {
      if (data.redirigir) {
        localStorage.setItem(
          "returningUserMessage",
          `Bienvenido de nuevo, ${data.usuario}`
        );
        window.location.href = data.redirigir;
      }
      throw new Error(data.mensaje);
    });
  }
  return response;
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay un mensaje de usuario que regresa
  const returningUserMessage = localStorage.getItem("returningUserMessage");
  if (returningUserMessage) {
    Swal.fire({
      icon: "info",
      title: returningUserMessage,
      timer: 3000,
      showConfirmButton: false,
    });
    localStorage.removeItem("returningUserMessage");
  }

  
  // Agregar event listener al formulario de login
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", handleLogin);
  } else {
    console.error("No se encontró el formulario de login");
  }
});

// Aplicar el manejador de expiración de sesión a todas las solicitudes fetch
const originalFetch = window.fetch;
window.fetch = function () {
  return originalFetch.apply(this, arguments).then(handleSessionExpiration);
};

async function obtenerUserId(correo) {
  try {
    const db = await connect();
    const [result] = await db.execute("SELECT id FROM usuarios WHERE correo = ?", [correo]);
    await db.end();
    
    if (result.length > 0) {
      return result[0].id;
    } else {
      throw new Error("No se encontró ningún usuario con ese correo.");
    }
  } catch (error) {
    console.error(error.message);
    throw error; // Vuelve a lanzar el error para que pueda ser manejado por el código que llama a esta función
  }
}