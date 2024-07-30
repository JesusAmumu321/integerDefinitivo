const calendario = document.querySelector(".calendar-custom"),
  fecha = document.querySelector(".date"),
  contenedorDias = document.querySelector(".dias"),
  anterior = document.querySelector(".prev"),
  siguiente = document.querySelector(".next"),
  hoyBtn = document.querySelector(".hoy-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  tiempoImput = document.querySelector(".tiempo-input"),
  diaEvento = document.querySelector(".evento-dia"),
  fechaEvento = document.querySelector(".evento-fecha"),
  eventosContenedor = document.querySelector(".eventos");

let hoy = new Date();
let diaActivo;
let mes = hoy.getMonth();
let año = hoy.getFullYear();

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

let eventosArr = [];

function iniciarCalendario() {
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  const ultimoDiaPrev = new Date(año, mes, 0);
  const diasPrev = ultimoDiaPrev.getDate();
  const fechaUltima = ultimoDia.getDate();
  const dia = primerDia.getDay();
  const diasSiguientes = 7 - ultimoDia.getDay() - 1;

  fecha.innerHTML = meses[mes] + " " + año;

  let diasHtml = "";

  for (let x = dia; x > 0; x--) {
    diasHtml += `<div class="dia prev-date">${diasPrev - x + 1}</div>`;
  }

  for (let i = 1; i <= fechaUltima; i++) {
    let evento = false;
    const eventosDia = eventosArr.find(e => e.dia === i && e.mes === mes + 1 && e.año === año);
    if (eventosDia && eventosDia.eventos.length > 0) {
      evento = true;
    }

    if (
      i === new Date().getDate() &&
      año === new Date().getFullYear() &&
      mes === new Date().getMonth()
    ) {
      diaActivo = i;
      obtenerDiaActivo(i);
      actualizarEventos(i);

      diasHtml += `<div class="dia hoy activo ${
        evento ? "evento" : ""
      }">${i}</div>`;    
    } else {
      diasHtml += `<div class="dia ${evento ? "evento" : ""}">${i}</div>`;
    }
  }

  for (let j = 1; j <= diasSiguientes; j++) {
    diasHtml += `<div class="dia next-date">${j}</div>`;
  }

  contenedorDias.innerHTML = diasHtml;
  agregarEscuchador();
}

// Función para formatear la hora en formato 24 horas
function formatearHora(fecha) {
  if (!(fecha instanceof Date) || isNaN(fecha)) {
      return "N/A";
  }
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  return `${hora}:${minutos}`;
}

function obtenerUserId() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No se encontró ID de usuario. El usuario debe iniciar sesión.');
    // Redirigir al usuario a la página de inicio de sesión si es necesario
    // window.location.href = '/login';
    return null;
  }
  return userId;
}

async function inicializarGeneracionDeEventos() {
  const userId = obtenerUserId();
  if (!userId) {
    console.error('No se pudo obtener el ID del usuario');
    return;
  }

  try {
    const response = await fetch('/getEventosMedicamentos', {
      headers: {
        'user-id': userId
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const eventos = await response.json();
    console.log('Eventos recibidos:', eventos);

    if (eventos.length === 0) {
      console.log('No se recibieron eventos');
      return;
    }

    eventosArr = eventos.map(evento => {
      const fechaEvento = new Date(evento.fecha_hora);
      return {
        dia: fechaEvento.getDate(),
        mes: fechaEvento.getMonth() + 1,
        año: fechaEvento.getFullYear(),
        eventos: [{
          titulo: evento.titulo,
          tiempo: formatearHora(fechaEvento),
          id: evento.id_evento,
          id_medicamento: evento.id_medicamento
        }]
      };
    });

    console.log('Eventos procesados:', eventosArr);

    // Agrupar eventos del mismo día
    eventosArr = eventosArr.reduce((acc, curr) => {
      const existingEvent = acc.find(e => e.dia === curr.dia && e.mes === curr.mes && e.año === curr.año);
      if (existingEvent) {
        existingEvent.eventos.push(...curr.eventos);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    console.log('Eventos agrupados:', eventosArr);

    iniciarCalendario(); // Llamar a esto aquí
  } catch (error) {
    console.error('Error al obtener eventos:', error);
  }
}

function formatearHora(fecha) {
  let horas = fecha.getHours();
  let minutos = fecha.getMinutes();
  minutos = minutos < 10 ? "0" + minutos : minutos;
  return horas + ":" + minutos;
}

function mesAnterior() {
  mes--;
  if (mes < 0) {
    mes = 11;
    año--;
  }
  iniciarCalendario();
}

function mesSiguiente() {
  mes++;
  if (mes > 11) {
    mes = 0;
    año++;
  }
  iniciarCalendario();
}

anterior.addEventListener("click", mesAnterior);
siguiente.addEventListener("click", mesSiguiente);
hoyBtn.addEventListener("click", () => {
  hoy = new Date();
  mes = hoy.getMonth();
  año = hoy.getFullYear();
  iniciarCalendario();
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = tiempoImput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      mes = dateArr[0] - 1;
      año = parseInt(dateArr[1]);
      iniciarCalendario();
      return;
    }
  }
  alert("fecha inválida");
}

function agregarEscuchador() {
  const dias = document.querySelectorAll(".dia");
  dias.forEach((dia) => {
    dia.addEventListener("click", (e) => {
      diaActivo = Number(e.target.textContent);
      obtenerDiaActivo(diaActivo);
      actualizarEventos(diaActivo);

      dias.forEach((d) => {
        d.classList.remove("activo");
      });

      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
        setTimeout(() => {
          const nuevoDias = document.querySelectorAll(".dia");
          nuevoDias.forEach((d) => {
            if (!d.classList.contains("prev-date") && d.textContent === e.target.textContent) {
              d.classList.add("activo");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        mesSiguiente();
        setTimeout(() => {
          const nuevoDias = document.querySelectorAll(".dia");
          nuevoDias.forEach((d) => {
            if (!d.classList.contains("next-date") && d.textContent === e.target.textContent) {
              d.classList.add("activo");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("activo");
      }
    });
  });
}

function obtenerDiaActivo(fecha) {
  const dia = new Date(año, mes, fecha);
  const opciones = { weekday: "long" };
  const nombreDia = dia.toLocaleDateString("es-ES", opciones);
  diaEvento.innerHTML = nombreDia;
  fechaEvento.innerHTML = fecha + " " + meses[mes] + " " + año;
  actualizarEventos(fecha);
}

function actualizarEventos(fecha) {
  let eventos = "";
  const eventosDia = eventosArr.find(e => e.dia === fecha && e.mes === mes + 1 && e.año === año);
  
  if (eventosDia) {
    eventosDia.eventos.forEach((evento) => {
      eventos += `
        <div class="evento">
          <div class="evento-contenido">
            <div class="titulo">
              <i class="fas fa-circle"></i>
              <h3 class="titulo-evento">${evento.titulo}</h3>
            </div>
            <div class="hora-evento">
              <span>${evento.tiempo}</span>
            </div>
          </div>
          <div class="boton-contenedor">
            <button class="treminar-toma-btn" onclick="borrarEvento(${evento.id}, ${evento.id_medicamento})">Borrar evento</button>
          </div>
        </div>`;
    });
  }

  if (eventos === "") {
    eventos = '<div class="no-evento"><h3>Sin eventos</h3></div>';
  }
  eventosContenedor.innerHTML = eventos;
}

async function borrarEvento(idEvento, idMedicamento) {
  try {
    // Preguntar al usuario si realmente desea borrar el evento
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres borrar este evento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo',
      cancelButtonText: 'Cancelar'
    });

    // Si el usuario confirma, proceder con el borrado
    if (resultado.isConfirmed) {
      const response = await fetch('/borrarEvento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': obtenerUserId()
        },
        body: JSON.stringify({ idEvento, idMedicamento })
      });
      
      if (response.ok) {
        await Swal.fire('¡Borrado!', 'El evento ha sido eliminado.', 'success');
        await inicializarGeneracionDeEventos(); // Recargar eventos
      } else {
        throw new Error('Error al borrar el evento');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    await Swal.fire('Error', 'No se pudo borrar el evento', 'error');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  inicializarGeneracionDeEventos().then(() => {
    iniciarCalendario();
  });
});