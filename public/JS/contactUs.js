// JavaScript Code Review

// 1. Event Listener Setup
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    const form = document.getElementById("formularioContacto");
    if (form) {
      console.log("Formulario encontrado");
      form.addEventListener("submit", handleContacto);
    } else {
      console.error("Formulario no encontrado");
    }
  });
  
  // 2. Form Submission Handler
  async function handleContacto(event) {
    console.log("Función handleContacto llamada");
    event.preventDefault();
    
    // Form data collection
    const usuario = document.getElementById("usuario").value;
    const correo = document.getElementById("correo").value;
    const razon_contacto = document.querySelector('input[name="razon"]:checked')?.value;
    const detalles = document.getElementById("detalles").value;
    const como_nos_ubico = document.getElementById("ubicacion").value;
    
    console.log("Valores del formulario:", { usuario, correo, razon_contacto, detalles, como_nos_ubico });
    
    // Form validation
    if (!usuario || !correo || !razon_contacto || !detalles || !como_nos_ubico) {
      console.log("Campos incompletos");
      Swal.fire({
        icon: "warning",
        title: "Por favor, complete todos los campos obligatorios.",
        allowOutsideClick: false,
      });
      return;
    }
    
    // API call
    try {
      console.log("Iniciando fetch");
      const response = await fetch("/api/agregar-contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, correo, razon_contacto, detalles, como_nos_ubico }),
      });
      
      console.log("Respuesta recibida:", response);
      const data = await response.json();
      console.log("Datos de respuesta:", data);
      
      // Success handling
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Mensaje enviado con éxito",
          text: "Gracias por contactarnos.",
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then(() => {
          console.log("Formulario reseteado");
          event.target.reset();
        });
      } else {
        throw new Error(data.message || "Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error durante el proceso de envío:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar el mensaje",
        text: error.message || "Por favor, intente nuevamente.",
        allowOutsideClick: false,
      });
    }
  }
  
  // HTML Review (key points)
  // - Form has id="formularioContacto"
  // - Input fields: usuario, correo, razon (radio), detalles, ubicacion (select)
  // - Submit button with id="envioContacto"