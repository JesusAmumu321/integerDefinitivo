document.addEventListener("DOMContentLoaded", () => {
  // Agregar el event listener al formulario de registro
  const form = document.getElementById("registroForm");
  if (form) {
    form.addEventListener("submit", handleRegistro);
  } else {
    console.error("No se encontró el formulario de registro");
  }
});

export async function handleRegistro(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const correo = document.getElementById("email").value;
  const contrasena = document.getElementById("contrasena").value;
  const confirmarContrasena = document.getElementById(
    "contrasena_confirmada"
  ).value;

  if (!usuario || !correo || !contrasena || !confirmarContrasena) {
    Swal.fire({
      icon: "warning",
      title:
        window.translations.errorMessagesRegistro.camposVacios ||
        "Por favor, complete todos los campos.",
      allowOutsideClick: false,
    });
    return;
  }

  if (contrasena !== confirmarContrasena) {
    Swal.fire({
      icon: "warning",
      title:
        window.translations.registroTexts.alertaContraseñaDistinta ||
        "Las contraseñas no coinciden. Por favor, intente nuevamente.",
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
      throw new Error(
        checkEmailData.mensaje ||
          window.translations.errorMessagesRegistro.errorServidor
      );
    }

    if (checkEmailData.existe) {
      Swal.fire({
        icon: "error",
        title:
          window.translations.registroTexts.alertaTituloCorreoRegistrado ||
          "El correo ya está registrado",
        text:
          window.translations.registroTexts.textAlertaTituloCorreoRegistrado ||
          "Por favor, utilice otro correo electrónico.",
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
        title:
          window.translations.registroTexts.alertaRegistroExitoso ||
          "Registro exitoso, redirigiendo...",
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(() => {
        window.location.href = "../HTML/login.html";
      });
    } else {
      throw new Error(
        dataRegistro.mensaje ||
          window.translations.errorMessagesRegistro.errorServidor
      );
    }
  } catch (error) {
    console.error("Error durante el proceso de registro:", error);
    Swal.fire({
      icon: "error",
      title:
        window.translations.registroTexts.alertaErrorAlRegistrarse ||
        "Error al registrarse",
      text:
        error.message ||
        window.translations.registroTexts.textoAlertaErrorAlRegistrarse ||
        "Por favor, intente nuevamente.",
      allowOutsideClick: false,
    });
  }
}
