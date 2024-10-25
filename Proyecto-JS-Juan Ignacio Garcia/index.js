document.getElementById('calcular').addEventListener('click', simularPago);

function simularPago() {
    const precio = parseFloat(document.getElementById('precio').value);
    const metodo = document.getElementById('metodo').value;
    const cuotas = parseInt(document.getElementById('cuotas').value);

    if (isNaN(precio) || precio <= 0) {
        alert("Por favor, ingrese un precio válido.");
        return;
    }
    
    if (cuotas < 1 || cuotas > 12) {
        alert("El número de cuotas debe estar entre 1 y 12.");
        return;
    }

    const metodosPago = {
        "efectivo": { descuento: 0.10, interes: 0 },
        "tarjeta-credito": { descuento: 0, interes: 0.05 },
        "tarjeta-debito": { descuento: 0, interes: 0 },
        "transferencia": { descuento: 0.05, interes: 0 }
    };

    const metodoSeleccionado = metodosPago[metodo];
    const descuento = metodoSeleccionado.descuento || 0;
    const interes = metodoSeleccionado.interes || 0;

    //Calcular el costo final
    let costoFinal = precio * (1 - descuento) * (1 + interes);
    let costoPorCuota = costoFinal / cuotas;

    //Redondea a dos decimales para una mejor presentación
    costoFinal = costoFinal.toFixed(2);
    costoPorCuota = costoPorCuota.toFixed(2);

    //Muestra el resultado
    mostrarResultado(metodo, costoFinal, costoPorCuota, cuotas);
}

function mostrarResultado(metodo, total, porCuota, cuotas) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <p>Método de Pago: <strong>${metodo}</strong></p>
        <p>Total a Pagar: <strong>$${total}</strong></p>
        <p>${cuotas > 1 ? `Monto por Cuota (${cuotas} cuotas): <strong>$${porCuota}</strong>` : "Pago único sin cuotas."}</p>
    `;
}
