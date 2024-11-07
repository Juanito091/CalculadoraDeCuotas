
let configuracion;

async function cargarConfiguracion() {
    try {
        const response = await fetch('configuracionPago.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la configuración.');
        }
        configuracion = await response.json();
        
        const ultimaSeleccion = JSON.parse(localStorage.getItem("ultimaSeleccion"));
        if (ultimaSeleccion) {
            configuracion.ultimaSeleccion = ultimaSeleccion;
        }
        
        inicializarSimulador();
    } catch (error) {
        console.error('Error al cargar la configuración:', error);
    }
}

function inicializarSimulador() {
    const metodoSelect = document.getElementById('metodo');
    const cuotasSelect = document.getElementById('cuotas');

    const { metodo, cuotas } = configuracion.ultimaSeleccion;
    metodoSelect.value = metodo || 'efectivo';
    cuotasSelect.value = cuotas || '1';

    actualizarCuotas();
    metodoSelect.addEventListener('change', actualizarCuotas);
    cuotasSelect.addEventListener('change', mostrarRecargo);

    metodoSelect.addEventListener('change', () => {
        guardarUltimaSeleccion(metodoSelect.value, cuotasSelect.value);
    });
    cuotasSelect.addEventListener('change', () => {
        guardarUltimaSeleccion(metodoSelect.value, cuotasSelect.value);
    });

    document.getElementById('calcular').addEventListener('click', simularPago);
}

function guardarUltimaSeleccion(metodo, cuotas) {
    configuracion.ultimaSeleccion = { metodo, cuotas };
    localStorage.setItem("ultimaSeleccion", JSON.stringify(configuracion.ultimaSeleccion));
}

function actualizarCuotas() {
    const metodo = document.getElementById('metodo').value;
    const cuotasSelect = document.getElementById('cuotas');
    cuotasSelect.innerHTML = ''; 

    const cuotasDisponibles = configuracion.metodosPago[metodo].cuotasDisponibles;
    cuotasDisponibles.forEach(cuota => {
        const option = document.createElement('option');
        option.value = cuota;
        option.textContent = `${cuota} cuota${cuota > 1 ? 's' : ''}`;
        cuotasSelect.appendChild(option);
    });

    const ultimaCuota = configuracion.ultimaSeleccion.cuotas;
    cuotasSelect.value = ultimaCuota || '1';

    mostrarRecargo();
}

function mostrarRecargo() {
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const detalleRecargoDiv = document.getElementById('detalleRecargo');

    const recargo = configuracion.recargosPorCuota[cuotas] ? (configuracion.recargosPorCuota[cuotas] * 100).toFixed(2) : "0.00";
    detalleRecargoDiv.innerHTML = `<p>Recargo para ${cuotas} cuota${cuotas > 1 ? 's' : ''}: <strong>${recargo}%</strong></p>`;
}

function simularPago() {
    const precio = parseFloat(document.getElementById('precio').value);
    const metodo = document.getElementById('metodo').value;
    const cuotas = parseInt(document.getElementById('cuotas').value);

    if (isNaN(precio) || precio <= 0) {
        alert("Por favor, ingrese un precio válido.");
        return;
    }

    const metodoSeleccionado = configuracion.metodosPago[metodo];
    const descuento = metodoSeleccionado.descuento || 0;
    const interes = metodoSeleccionado.interes || 0;
    const recargoCuotas = configuracion.recargosPorCuota[cuotas] || 0;

    let costoFinal = precio * (1 - descuento) * (1 + interes) * (1 + recargoCuotas);
    let costoPorCuota = costoFinal / cuotas;

    costoFinal = costoFinal.toFixed(2);
    costoPorCuota = costoPorCuota.toFixed(2);

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

cargarConfiguracion();