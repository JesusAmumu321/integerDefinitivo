// Función para verificar la sesión
async function verificarSesion() {
  try {
    const response = await fetch("/api/verificar-sesion");
    const data = await response.json();
    if (data.autenticado) {
      window.location.href = "../HTML/agregarMed.html"; // Redirigir si la sesión es válida
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
  }
}

// funcion para el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

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
        title: "Inicio de sesión exitoso, redirigiendo...",
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(() => {
        window.location.href = "../HTML/agregarMed.html";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al inicio de sesión",
        text: data.mensaje,
        allowOutsideClick: false,
      });
    }
  } catch (error) {
    console.error("Error durante el proceso de inicio de sesión.", error);
    Swal.fire({
      icon: "error",
      title: "Error al inicio de sesión. Por favor, intente nuevamente.",
      text: error.message,
      allowOutsideClick: false,
    });
  }
}

// Función para manejar la expiración de sesión
// function handleSessionExpiration(response) {
//   if (response.status === 401) {
//     return response.json().then((data) => {
//       if (data.redirigir) {
//         localStorage.setItem(
//           "returningUserMessage",
//           `Bienvenido de nuevo, ${data.usuario}`
//         );
//         window.location.href = data.redirigir;
//       }
//       throw new Error(data.mensaje);
//     });
//   }
//   return response;
// }

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

  // Verificar sesión
  verificarSesion();

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
