document.addEventListener("DOMContentLoaded", function () {
  function calcularProximaToma(fechaFinalStr, intervaloHoras) {
    console.log("fechaFinalStr:", fechaFinalStr); // Log el valor de fechaFinalStr

    // Verificar si fechaFinalStr es válida
    const fechaFinal = fechaFinalStr ? new Date(fechaFinalStr) : null;
    console.log("fechaFinal:", fechaFinal); // Log el objeto fechaFinal

    if (!fechaFinal || isNaN(fechaFinal.getTime())) {
      console.warn("Fecha final no válida:", fechaFinalStr);
      return []; // Retornar un array vacío si la fecha no es válida
    }
    fechaFinal.setHours(23, 59, 59, 999); // Establecer la hora al final del día

    const fechaActual = new Date();
    console.log(
      "Fecha Actual:",
      fechaActual.toLocaleDateString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    );
    console.log(
      "Fecha Final:",
      fechaFinal.toLocaleDateString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    );
    console.log("Intervalo Horas:", intervaloHoras);

    // Crear un array para almacenar las fechas calculadas
    const fechasCalculadas = [];

    // Calcular fechas desde la fecha actual hasta la fecha final
    let fechaTemporal = new Date(fechaActual);
    fechaTemporal.setSeconds(0, 0); // Redondear a los minutos

    // Ajustar la hora inicial para que comience desde un intervalo válido
    if (fechaTemporal.getHours() < 7) {
      fechaTemporal.setHours(7, 0, 0, 0);
    } else if (fechaTemporal.getHours() > 22) {
      fechaTemporal.setDate(fechaTemporal.getDate() + 1);
      fechaTemporal.setHours(7, 0, 0, 0);
    } else {
      // Ajustar al siguiente intervalo si la hora actual no es un múltiplo del intervalo
      const minutosRestantes =
        (intervaloHoras - (fechaTemporal.getHours() % intervaloHoras)) %
        intervaloHoras;
      if (minutosRestantes !== 0) {
        fechaTemporal.setHours(
          fechaTemporal.getHours() + minutosRestantes,
          0,
          0,
          0
        );
      }
    }

    while (fechaTemporal <= fechaFinal) {
      if (fechaTemporal.getHours() >= 7 && fechaTemporal.getHours() <= 22) {
        fechasCalculadas.push(new Date(fechaTemporal));
      }
      fechaTemporal.setHours(fechaTemporal.getHours() + intervaloHoras);
    }

    // Ordenar las fechas por proximidad (de la más cercana a la más lejana)
    fechasCalculadas.sort((a, b) => a - b);
    console.log(
      "Fechas Calculadas:",
      fechasCalculadas.map((fecha) =>
        fecha.toLocaleDateString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    );
    return fechasCalculadas;
  }

  function buildTable(data) {
    const table = document.getElementById("laTablona");
    for (let i = 0; i < data.length; i++) {
      const fechaFinal = data[i].fechaFinal || "N/A";
      const proximaTomaArr = calcularProximaToma(
        data[i].ultimaToma,
        data[i].frecuenciaToma
      );
      const proximaToma =
        proximaTomaArr.length > 0
          ? proximaTomaArr[0].toLocaleDateString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "juanchi";

      const row = `<tr class="bg-gray-200 text-2xl">
                <td class="border border-gray-400 p-4 align-center text">${
                  data[i].nombreMed
                }</td>
                <td class="border border-gray-400 p-4 align-center">${new Date(
                  data[i].caducidadMed
                ).toLocaleDateString("es-ES")}</td>
                <td class="border border-gray-400 p-4 align-center">${
                  data[i].cantidadUnaCaja
                }</td>
                <td class="border border-gray-400 p-4 align-center">${
                  data[i].cantidadDosis
                }</td>
                <td class="border border-gray-400 p-4 align-center">${proximaToma}</td>
                <td class="border border-gray-400 p-4 align-center">${new Date(
                  data[i].ultimaToma
                ).toLocaleDateString("es-ES")}</td>
            </tr>`;
      table.innerHTML += row;
    }
  }

  fetch("/getMedicamentos")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Datos recibidos:", data);
      buildTable(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Error al obtener los datos: ${error.message}`);
    });
});
