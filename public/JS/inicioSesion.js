// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("envioLogin");
//   if (form) {
//     form.addEventListener("submit", handleInicio);
//   }
// });

// export async function handleInicio(event) {
//   event.preventDefault(); // prevenir comportamiento predeterminado

//   const correo = document.getElementById("correo").value;
//   const contrasena = document.getElementById("contrasena").value;

//   try {

//     const response = await fetch("/api/iniciar", {

//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ correo, contrasena }),

//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (data.autenticado) {
//         window.location.href = "../HTML/agregarMed.html"; // redirigir a la página de agregar medicamento
//       } else {
//         alert(
//           "Correo o contraseña incorrectos. Por favor, intente nuevamente."
//         );
//       }
//     } else {

//       const data = await response.json();
//       alert(`Ocurrió un error al momento de iniciar sesión: ${data.message}`);

//     }
//   } catch (error) {

//     console.error("ERROR:", error);
//     alert("Error en el inicio de sesión. Por favor, intente nuevamente.");

//   }
// }
