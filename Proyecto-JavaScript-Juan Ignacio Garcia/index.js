//Función para calcular el interés basado en las cuotas seleccionadas
function calcularInteres(total, cuotas) {
    let interes = 0;

    //Determina el interés según las cuotas
    if (cuotas === 1) {
        interes = 0; 
    } else if (cuotas === 3) {
        interes = 0.05; 
    } else if (cuotas === 6) {
        interes = 0.10;
    } else if (cuotas === 12) {
        interes = 0.20; 
    } else {
        return "Número de cuotas no disponible.";
    }

    //Calcula el monto total del interes
    const totalConInteres = total + (total * interes);
    
    return {
        totalConInteres: totalConInteres.toFixed(2),
        porcentajeInteres: interes * 100
    };
}

//Manejar el formulario
document.getElementById('calculoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario y recarga de la página

    //Obtener los valores ingresados
    const total = parseFloat(document.getElementById('total').value);
    const cuotas = parseInt(document.getElementById('cuotas').value);

    if (isNaN(total) || total <= 0) {
        document.getElementById('resultadoTexto').textContent = "Por favor, ingresa un total válido.";
        return;
    }

    //Lamamos a la función para calcular el interes
    const resultado = calcularInteres(total, cuotas);

    //Muestra el resultado
    document.getElementById('resultadoTexto').textContent = `El total a pagar con ${cuotas} cuotas será de $${resultado.totalConInteres} (incluye un interés de ${resultado.porcentajeInteres}%).`;
});
