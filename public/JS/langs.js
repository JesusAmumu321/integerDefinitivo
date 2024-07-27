document.addEventListener("DOMContentLoaded", () => {
  const textoCarruselContainer = document.getElementById(
    "textoCarruselContainer"
  );
  const items = document.querySelectorAll(".carrusel-item");
  const botonesInferiores = document.querySelectorAll(".botonInferior");

  let indexActual = 0;
  let textos = [];
  let gifs = [];

  const changeLanguage = async (language) => {
    try {
      const requestJSON = await fetch(`../languages/${language}.json`);
      const texts = await requestJSON.json();

      // actualiza los textos y botones
      const textsToChange = document.querySelectorAll("[data-section]");

      textsToChange.forEach((textToChange) => {
        const section = textToChange.dataset.section;
        const value = textToChange.dataset.value;

        if (textToChange.tagName === "BUTTON") {
          // ... (código para botones sin cambios)
        } else if (textToChange.tagName === "A") {
          // Manejar enlaces de forma especial
          textToChange.textContent = texts[section][value];
        } else if (textToChange.querySelector("a")) {
          // Manejar párrafos que contienen enlaces
          const link = textToChange.querySelector("a");
          const linkSection = link.dataset.section;
          const linkValue = link.dataset.value;

          // Crear un nodo de texto para el contenido del párrafo
          const textNode = document.createTextNode(texts[section][value]);

          // Limpiar el contenido actual del párrafo
          textToChange.innerHTML = "";

          // Añadir el nodo de texto
          textToChange.appendChild(textNode);

          // Actualizar el texto del enlace
          link.textContent = texts[linkSection][linkValue];

          // Añadir el enlace de vuelta al párrafo
          textToChange.appendChild(link);
        } else {
          const originalHTML = textToChange.innerHTML;
          const asterisk = originalHTML.includes(
            '<span class="text-red-500">*</span>'
          )
            ? '<span class="text-red-500">*</span>'
            : "";

          textToChange.innerHTML = texts[section][value] + asterisk;
        }
      });

      // Actualizar los días de la semana
      actualizarDiasSemana(texts);

      // aqui se crean las cosas dinamicas
      if (textoCarruselContainer) {
        textoCarruselContainer.innerHTML = "";
        textos = texts.carrusel.textos;
        gifs = texts.carrusel.gifs;

        textos.forEach((texto, index) => {
          const p = document.createElement("p");
          p.className =
            "textoCarruselItem text-xl sm:text-2xl font-normal mb-5 animation-fade";
          p.textContent = texto;
          p.dataset.index = index;

          p.style.position = "absolute";
          p.style.top = "0";
          p.style.left = "0";
          p.style.width = "100%";
          p.style.textAlign = "left";
          p.style.paddingLeft = "10px";

          textoCarruselContainer.appendChild(p);
        });

        // Mostrar el primer texto
        mostrarItem(indexActual);
      }

      // Guardar el idioma seleccionado en localStorage
      localStorage.setItem("language", language);
    } catch (error) {
      console.error("Error al cambiar el idioma:", error);
    }
  };

  const mostrarItem = (index) => {
    if (items.length > 0 && botonesInferiores.length > 0) {
      items.forEach((item, i) => {
        item.classList.add("opacity-0");
        item.classList.remove("opacity-100");
        if (i === index) {
          item.classList.remove("opacity-0");
          item.classList.add("opacity-100");
          item.style.backgroundImage = `url(${gifs[i]})`;
        }
      });

      botonesInferiores.forEach((boton, i) => {
        if (i === index) {
          boton.classList.remove("bg-gray-300");
          boton.classList.add("bg-black");
        } else {
          boton.classList.remove("bg-black");
          boton.classList.add("bg-gray-300");
        }
      });
    }

    if (textoCarruselContainer) {
      textoCarruselContainer
        .querySelectorAll(".textoCarruselItem")
        .forEach((p, i) => {
          p.style.opacity = i === index ? "1" : "0";
        });
    }
  };

  const siguienteItem = () => {
    indexActual = (indexActual + 1) % textos.length;
    mostrarItem(indexActual);
  };

  // cargar el idioma guardado en el local storage
  const loadSaveLang = () => {
    const savedLanguage = localStorage.getItem("language") || "es";
    changeLanguage(savedLanguage);
  };

  if (document.getElementById("flags")) {
    document.getElementById("flags").addEventListener("click", (e) => {
      const language = e.target.closest(".flags__item")?.dataset.language;
      if (language) {
        changeLanguage(language);
      }
    });
  } else {
    console.error("El id 'flags' no se encontró");
  }

  // carga el idioma al cargar la página
  loadSaveLang();

  // solo inicia el intervalo si existe el carrusel
  if (textoCarruselContainer) {
    const intervalo = setInterval(siguienteItem, 5000);
  }

  // funcion actializar los dias d la sea
  const actualizarDiasSemana = (texts) => {
    const divs = document.querySelectorAll(".diasSemana div");

    divs.forEach((div) => {
      const dataValue = div.getAttribute("data-value");
      const [section, key] = dataValue.split(".");

      if (
        section === "diasSemanaAbreviado" &&
        texts.divCalendario &&
        texts.divCalendario.diasSemanaAbreviado
      ) {
        div.textContent = texts.divCalendario.diasSemanaAbreviado[key];
      }
    });
  };

  // esto es para el calendaroi




});
