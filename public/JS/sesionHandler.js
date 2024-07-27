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

// // Sobrescribir la función fetch global para manejar la expiración de sesión en todas las solicitudes
// const originalFetch = window.fetch;
// window.fetch = function () {
//   return originalFetch.apply(this, arguments).then(handleSessionExpiration);
// };

// // Función para verificar la sesión al cargar la página
// function verificarSesion() {
//   fetch("/api/verificar-sesion")
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data.autenticado) {
//         // Si no está autenticado, redirigir a la página de login
//         window.location.href = "/login";
//       }
//     })
//     .catch((error) => {
//       console.error("Error al verificar la sesión:", error);
//       // En caso de error, también redirigimos al login por seguridad
//       window.location.href = "/login";
//     });
// }

// // Ejecutar verificación de sesión cuando se carga el documento
// document.addEventListener("DOMContentLoaded", verificarSesion);
