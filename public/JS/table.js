document.addEventListener("DOMContentLoaded", function () {
  function buildTable(data) {
    const table = document.getElementById("laTablona");
    table.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

    for (let i = 0; i < data.length; i++) {
        const fechaFinal = data[i].fechaFinal || "N/A";
        const proximaTomaArr = calcularProximaToma(
            data[i].ultimaToma,
            data[i].frecuenciaToma
        );
        
        let proximaToma = "N/A";
        if (proximaTomaArr.length > 0) {
            proximaToma = proximaTomaArr[0];
        }

        const row = `<tr class="bg-gray-200 text-2xl">
            <td class="border border-gray-400 p-4 align-center text">${data[i].nombreMed}</td>
            <td class="border border-gray-400 p-4 align-center">${new Date(data[i].caducidadMed).toLocaleDateString("es-ES")}</td>
            <td class="border border-gray-400 p-4 align-center">${data[i].cantidadUnaCaja}</td>
            <td class="border border-gray-400 p-4 align-center">${data[i].cantidadDosis}</td>
            <td class="border border-gray-400 p-4 align-center">${formatearFecha(proximaToma)}</td>
            <td class="border border-gray-400 p-4 align-center">${new Date(data[i].ultimaToma).toLocaleDateString("es-ES")}</td>
        </tr>`;
        
        table.innerHTML += row;
    }
}

// Función para formatear la fecha de próxima toma
function formatearFecha(fecha) {
    if (!(fecha instanceof Date) || isNaN(fecha)) {
        return "N/A";
    }
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    return (`{hora}:${minutos} ${dia}/${mes}/${año}`);
}

// Función completa para calcular la próxima toma
function calcularProximaToma(fechaFinalStr, intervaloHoras) {
    const fechaFinal = new Date(fechaFinalStr);
    const fechasCalculadas = [];
    let fechaActual = new Date();

    // Definir los horarios específicos para cada intervalo
    const horarios = {
        8: [7, 15, 23],  // 7:00, 15:00, 23:00
        6: [8, 14, 20],  // 8:00, 14:00, 20:00
        12: [8, 20],     // 8:00, 20:00
        24: [8],         // 8:00
        10: [8, 18],     // 8:00, 18:00
    };

    // Función para establecer la hora en una fecha
    function setHora(fecha, hora) {
        return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hora, 0, 0);
    }

    // Encontrar la próxima hora válida desde la fecha actual
    function encontrarProximaHoraValida(fecha) {
        const horasValidas = horarios[intervaloHoras];
        const horaActual = fecha.getHours();
        
        for (let hora of horasValidas) {
            if (hora > horaActual || (hora === horaActual && fecha.getMinutes() === 0)) {
                return setHora(fecha, hora);
            }
        }
        // Si no encontramos una hora válida hoy, ir al primer horario del día siguiente
        return setHora(new Date(fecha.getTime() + 24 * 60 * 60 * 1000), horasValidas[0]);
    }

    fechaActual = encontrarProximaHoraValida(fechaActual);

    while (fechaActual <= fechaFinal) {
        fechasCalculadas.push(new Date(fechaActual));
        
        // Encontrar la próxima hora válida
        const horasValidas = horarios[intervaloHoras];
        let proximaHora = horasValidas[(horasValidas.indexOf(fechaActual.getHours()) + 1) % horasValidas.length];
        
        if (proximaHora <= fechaActual.getHours()) {
            // Si la próxima hora es menor o igual, significa que pasamos al día siguiente
            fechaActual = new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000);
        }
        fechaActual = setHora(fechaActual, proximaHora);
    }

    return fechasCalculadas;
}

const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No se encontró el userId en localStorage');
    return;
  }

  fetch("/getMedicamentos", {
    headers: {
      'user-id': userId
    }
})
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
