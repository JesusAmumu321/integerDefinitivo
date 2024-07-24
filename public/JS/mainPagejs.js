// Med & Track Version: 1.0
// con el doom, se espera a que el documento este cargado para ejecutar el codigo
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".carrusel-item");
  const textoCarrusel = document.getElementById("textoCarrusel");
  const botonesInferiores = document.querySelectorAll(".botonInferior");
  let indexActual = 0;
  const textos = [
    "Obtenga un mejor monitoreo de sus medicamentos.",
    "Agregue los medicamentos que desee.",
    "Obtenga un calendario para su medicación.",
    "Descargue su calendario en cualquier momento."
  ];
  const gifs = [
    "ruta/al/gif1.gif",
    "ruta/al/gif2.gif",
    "ruta/al/gif3.gif",
    "ruta/al/gif4.gif",
  ];

  function mostrarItem(index) {
    items.forEach((item, i) => {
      item.classList.add("opacity-0"); // este esta cambiado, el opcacity-100 va aqui y este va abajo
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

    textoCarrusel.classList.remove("animation-fade");
    
    void textoCarrusel.offsetWidth; // reinicia animacion
    
    textoCarrusel.classList.add("animation-fade");

    textoCarrusel.textContent = textos[index];
    
    textoCarrusel.style.opacity = "1";
  }
  
  function siguienteItem() {
    indexActual = (indexActual + 1) % items.length; // le suma 1 al index actual y con el resuduo de la
    // division por la cantidad de items y
    // se asegura de que el index no sobrepase la cantidad de items
    mostrarItem(indexActual);
  }

  // cambia el carrusel cada 5s
  const intervalo = setInterval(siguienteItem, 5000);

  // muestra el primer item en verguisa
  mostrarItem(0);
});
