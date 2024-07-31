document.addEventListener("DOMContentLoaded", function () {
  const btnDescarga = document.getElementById("btnDescarga");
  btnDescarga.addEventListener("click", descargarCalendario);
});

function descargarCalendario() {
  const calendario = document.getElementById("mi-calendario");
  
  calendario.style.overflow = "hidden";
  calendario.style.width= '100%'
  calendario.style.height= 'auto';

  html2canvas(calendario,{
    scale:2,
    userCors:true
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "calendario_med_and_track.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}