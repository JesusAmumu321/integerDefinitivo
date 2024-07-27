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
  getEvents();
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
    eventosArr.forEach((objetoEvento) => {
      if (
        objetoEvento.dia === i &&
        objetoEvento.mes === mes + 1 &&
        objetoEvento.año === año
      ) {
        evento = true;
      }
    });

    if (
      i === hoy.getDate() &&
      año === hoy.getFullYear() &&
      mes === hoy.getMonth()
    ) {
      diaActivo = i;
      obtenerDiaActivo(i);
      actualizarEventos(i);

      diasHtml += `<div class="dia siempre activo ${evento ? "evento" : ""}">${i}</div>`;
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

window.generarEventosAutomaticos = function generarEventosAutomaticos(
  titulo,
  intervaloHoras,
  fechaFin
) {
  let fechaActual = new Date();

  if (typeof fechaFin === "string") {
    fechaFin = new Date(fechaFin);
  }

  // Ajustar la fecha final para que incluya todo el día
  const fechaFinal = new Date(fechaFin);
  fechaFinal.setHours(23, 59, 59, 999);

  console.log("Fecha inicial:", fechaActual);
  console.log("Fecha final:", fechaFinal);

  while (fechaActual <= fechaFinal) {
    const eventoExistente = eventosArr.find(
      (evento) =>
        evento.dia === fechaActual.getDate() &&
        evento.mes === fechaActual.getMonth() + 1 &&
        evento.año === fechaActual.getFullYear() &&
        evento.eventos.some(
          (e) => e.titulo === titulo && e.tiempo === formatearHora(fechaActual)
        )
    );

    if (!eventoExistente) {
      const evento = {
        dia: fechaActual.getDate(),
        mes: fechaActual.getMonth() + 1,
        año: fechaActual.getFullYear(),
        eventos: [
          {
            titulo: titulo,
            tiempo: formatearHora(fechaActual),
            esAutomatico: true,
          },
        ],
      };

      eventosArr.push(evento);
      console.log("Evento agregado:", evento);
    }

    fechaActual = new Date(fechaActual.getTime() + intervaloHoras * 60 * 60 * 1000);
  }

  console.log("Eventos generados:", eventosArr);
  saveEvents();
  iniciarCalendario();
};

function formatearHora(fecha) {
  let horas = fecha.getHours();
  let minutos = fecha.getMinutes();
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12;
  horas = horas ? horas : 12;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  return horas + ":" + minutos + ' ' + ampm;
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
      diaActivo = parseInt(e.target.innerHTML);
      obtenerDiaActivo(diaActivo);
      actualizarEventos(diaActivo);

      dias.forEach((dia) => {
        dia.classList.remove("activo");
      });

      if (e.target.classList.contains("prev-date")) {
        mesAnterior();
      } else if (e.target.classList.contains("next-date")) {
        mesSiguiente();
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
}

function actualizarEventos(fecha) {
  let eventos = "";
  eventosArr.forEach((eventoDia) => {
    if (
      fecha === eventoDia.dia &&
      mes + 1 === eventoDia.mes &&
      año === eventoDia.año
    ) {
      eventoDia.eventos.forEach((evento) => {
        eventos += 
  `<div class="evento">
    <div class="titulo">
      <i class="fas fa-circle"></i>
      <h3 class="titulo-evento">${evento.titulo}</h3>
    </div>
    <div class="hora-evento">
      <span class="hora-evento">${evento.tiempo}</span>
    </div>
  </div>`;
      });
    }
  });

  if (eventos === "") {
    eventos =
      '<div class="no-evento"><h3 >Sin eventos</h3></div>';
  }
  eventosContenedor.innerHTML = eventos;
  saveEvents();
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventosArr));
}

function getEvents() {
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventosArr = JSON.parse(localStorage.getItem("events"));
}

function borrarEventosAutomaticos() {
  console.log("Función borrarEventosAutomaticos llamada");
  eventosArr = eventosArr.filter(
    (evento) => !evento.eventos.some((e) => e.esAutomatico)
  );

  saveEvents();

  iniciarCalendario();

  console.log("Todos los eventos automáticos han sido borrados");
}

document.addEventListener('DOMContentLoaded', function() {
  iniciarCalendario();
});
