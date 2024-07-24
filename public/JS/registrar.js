document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  if (form) {
    form.addEventListener("submit", handleRegistro);
  }
});

async function handleRegistro(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const correo = document.getElementById("email").value;
  const contrasena = document.getElementById("contrasena").value;
  const confirmarContrasena = document.getElementById(
    "contrasena_confirmada"
  ).value;

  if (contrasena !== confirmarContrasena) {
    Swal.fire({
      icon: "warning",
      title: "Las contraseñas no coinciden. Por favor, intente nuevamente.",
      allowOutsideClick: false,
    });
    return;
  }

  try {
    // Verificar si el correo ya existe
    const responseEmail = await fetch("/api/verificar-correo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo }),
    });

    const checkEmailData = await responseEmail.json();

    if (!responseEmail.ok) {
      throw new Error(checkEmailData.mensaje || "Error al verificar el correo");
    }

    if (checkEmailData.existe) {
      Swal.fire({
        icon: "error",
        title: "El correo ya está registrado",
        text: "Por favor, utilice otro correo electrónico.",
        allowOutsideClick: false,
      });
      return;
    }

    // Si el correo no existe, proceder con el registro
    const responseRegistro = await fetch("/api/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, correo, contrasena }),
    });

    const dataRegistro = await responseRegistro.json();

    if (responseRegistro.ok) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso, redirigiendo...",
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(() => {
        window.location.href = "../HTML/login.html";
      });
    } else {
      throw new Error(dataRegistro.mensaje || "Error al registrarse");
    }
  } catch (error) {
    console.error("Error durante el proceso de registro:", error);
    Swal.fire({
      icon: "error",
      title: "Error al registrarse",
      text: error.message || "Por favor, intente nuevamente.",
      allowOutsideClick: false,
    });
  }
}
