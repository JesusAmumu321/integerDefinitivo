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

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  // validacion basica del cilente
  if (!correo || !contrasena) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacíos",
      text: "Por favor, complete todos los campos.",
      allowOutsideClick: false,
    });
    return;
  }

  // validacion simple para correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(correo)) {
    Swal.fire({
      icon: "error",
      title: "Correo inválido",
      text: "Por favor, ingrese un correo electrónico válido.",
      allowOutsideClick: false,
    });
    return;
  }

  // Mostrar indicador de carga
  Swal.fire({
    title: "Iniciando sesión",
    text: "Por favor espere...",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });

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
      if (data.autenticado) {
        // Guardar el ID del usuario de forma segura (considerar usar httpOnly cookies en producción)
        localStorage.setItem("userId", data.userId);

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Redirigiendo...",
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
        }).then(() => {
          window.location.href = "../HTML/agregarMed.html";
        });
      } else {
        throw new Error(data.mensaje || "Error de autenticación");
      }
    } else {
      throw new Error(data.mensaje || `Error del servidor: ${response.status}`);
    }
  } catch (error) {
    console.error("Error durante el proceso de inicio de sesión:", error);

    let errorMessage = "Ha ocurrido un error. Por favor, intente nuevamente.";
    if (error.message === "Usuario no encontrado") {
      errorMessage =
        "No se encontró ningún usuario con ese correo electrónico.";
    } else if (error.message === "Contraseña incorrecta") {
      errorMessage = "La contraseña ingresada es incorrecta.";
    }

    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: errorMessage,
      allowOutsideClick: false,
    });
  }
}

// Agregar el event listener cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", handleLogin);
  } else {
    console.error("No se encontró el formulario de login");
  }
});

// Función para manejar la expiración de sesión
async function handleSessionExpiration(response) {
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
    const [result] = await db.execute(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );
    await db.end();

    console.log(result); // entra

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
