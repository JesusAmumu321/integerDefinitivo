function inicializarFormularioMedicamentos() {
  const tipoMedicamento = document.getElementById("tipo_medicamento");
  const cantidadDosisLabel = document.getElementById("cantidadDosisLabel");
  const cantidadDosisInput = document.getElementById("cantidadDosis");
  const cantidadUnaCajaLabel = document.querySelector(
    'label[for="cantidadUnaCaja"]'
  );
  const cantidadUnaCajaInput = document.getElementById("cantidadUnaCaja");
  const cantidadCajasLabel = document.getElementById("cantidadUnaCaja2");
  const cantidadCajasInput = document.getElementById("cantidadCajas");

  const inputsNumeroPositivo = document.querySelectorAll(
    "input.numero-positivo"
  );

  inputsNumeroPositivo.forEach((input) => {
    input.addEventListener("input", function () {
      let value = this.value.trim();
      let numValue = parseFloat(value);

      if (value === "" || isNaN(numValue) || numValue <= 0) {
        this.value = "";
      } else {
        this.value = Math.floor(numValue);
      }
    });
  });

  tipoMedicamento.addEventListener("change", function () {
    if (this.value === "ml") {
      cantidadDosisLabel.innerHTML =
        'Cantidad de mililitros por dosis: <span class="text-red-500">*</span>';
      cantidadDosisInput.placeholder = "Ej. 5";

      cantidadUnaCajaLabel.innerHTML =
        'Cantidad de mililitros por frasco: <span class="text-red-500">*</span>';
      cantidadUnaCajaInput.placeholder = "Ej. 100";

      cantidadCajasLabel.innerHTML =
        'Cantidad de frascos disponibles: <span class="text-red-500">*</span>';
      cantidadCajasInput.placeholder = "Ej. 2";
    } else if (this.value === "pastillas") {
      cantidadDosisLabel.innerHTML =
        'Cantidad de pastillas por dosis: <span class="text-red-500">*</span>';
      cantidadDosisInput.placeholder = "Ej. 2";

      cantidadUnaCajaLabel.innerHTML =
        'Cantidad de unidades por caja: <span class="text-red-500">*</span>';
      cantidadUnaCajaInput.placeholder = "Ej. 10";

      cantidadCajasLabel.innerHTML =
        'Cantidad de cajas disponibles: <span class="text-red-500">*</span>';
      cantidadCajasInput.placeholder = "Ej. 3";
    }
  });

  document
    .getElementById("envioMedicamento")
    .addEventListener("click", async function (e) {
      e.preventDefault();

      const medicamento = {
        tipo_medicamento: document.getElementById("tipo_medicamento").value,
        frecuenciaToma: document.getElementById("frecuenciaToma").value,
        nombreMed: document.getElementById("nombreMed").value,
        cantidadDosis: document.getElementById("cantidadDosis").value,
        cantidadUnaCaja: document.getElementById("cantidadUnaCaja").value,
        cantidadCajas: document.getElementById("cantidadCajas").value,
        caducidadMed: document.getElementById("caducidadMed").value,
        ultimaToma: document.getElementById("ultimaToma").value,
      };

      // Validación de campos obligatorios
      const camposObligatorios = [
        "tipo_medicamento",
        "frecuenciaToma",
        "nombreMed",
        "cantidadDosis",
        "cantidadUnaCaja",
        "cantidadCajas",
      ];
      const camposFaltantes = camposObligatorios.filter(
        (campo) => !medicamento[campo]
      );

      if (camposFaltantes.length < 0) {
        Swal.fire({
          icon: "error",
          title: "Campos obligatorios faltantes",
          text: "Por favor, complete todos los campos obligatorios.",
          allowOutsideClick: false,
        });
        return;
      }

      try {
        const response = await fetch("/api/agregar-medicamento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
          body: JSON.stringify(medicamento),
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Se agregó el medicamento de manera correcta.",
            allowOutsideClick: false,
          });
          // Limpiar formulario
          document.querySelector("form").reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al agregar el medicamento.",
            text: data.message,
            allowOutsideClick: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error, por favor, inténtelo de nuevo.",
          text: error.message,
          allowOutsideClick: false,
        });
      }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  inicializarFormularioMedicamentos();
});
