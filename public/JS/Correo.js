const { response } = require("express");

function enviarCorreo (nombreMed,cantidadUnaCaja,correo){
fetch('/enviar-correo',{
    method: 'POST',
    body: JSON.stringify({
        nombreMed: nombreMed,
        cantidadUnaCaja: cantidadUnaCaja,
        destinatario: correo
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error en la solicitud');
    }
    return response.json();
})
.then(data => {
    console.log('Respuesta del servidor:', data);   

    if (data.success) {
        console.log('Correo enviado correctamente');
    } else {
        console.error('Error al enviar el correo:', data.error);
    }
})
.catch(error => {
    console.error('Error en la solicitud:', error);
});
}

    function calcularCantidadNecesaria(medicamento, fechas) {
        return fechas.length * medicamento.cantidadDosis * medicamento.frecuenciaToma;
    }
async function verificarmedicamento(fechasCalculadas,userId){
    const umbralAlerta = 5;
    const [medicamentos] = await db.execute(
        "SELECT * FROM medicamento WHERE Pk_usuario = ?  ",
        [userId]
    )
      await db.end();
    medicamentos.forEach(medicamento => {
        // Calcular la cantidad total necesaria para todas las fechas
        const cantidadNecesaria = calcularCantidadNecesaria(medicamento, fechasCalculadas);

        // Verificar si la cantidad total disponible es menor que la necesaria
        if (medicamento.cantidad_total < cantidadNecesaria - umbralAlerta) {
            enviarCorreo(medicamento.nombreMed, medicamento.cantidadUnaCaja);
        }
    })
}

