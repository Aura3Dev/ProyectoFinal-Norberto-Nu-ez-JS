let datosGuardados = {
    monto: '',
    interes: '',
    años: '',
    pagoMensual: '',
    montoTotal: ''
};

function cargarDatosGuardados() {
    let datosPrestamo = localStorage.getItem('datosPrestamo');
    if (datosPrestamo) {
        datosGuardados = JSON.parse(datosPrestamo);
        renderizarDatosGuardados();
    }
}

document.getElementById('credit-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    calcularPrestamo(event);
});


function guardarDatos(data) {

    data.monto = parseFloat(data.monto) || 0;
    data.interes = parseFloat(data.interes) || 0;
    data.años = parseInt(data.años) || 0;
    data.pagoMensual = parseFloat(data.pagoMensual) || 0;
    data.montoTotal = parseFloat(data.montoTotal) || 0;

    datosGuardados = data; 
    localStorage.setItem('datosPrestamo', JSON.stringify(data));
}

function renderizarDatosGuardados() {
    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h3>Resultado Crediticio:</h3>';
    
    for (let key in datosGuardados) {
        if (datosGuardados.hasOwnProperty(key)) {
            let value = datosGuardados[key];
            if (key === 'pagoMensual' || key === 'montoTotal') {
                outputDiv.innerHTML += `<p>${key.charAt(0).toUpperCase() + key.slice(1)}: $${value.toFixed(2)}</p>`;
            } else {
                outputDiv.innerHTML += `<p>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || 'No disponible'}</p>`;
            }
        }
    }

    outputDiv.innerHTML += '<style>p:nth-last-child(2) { margin-bottom: 10px; }</style>';
}

function calcularPrestamo(event) {
    event.preventDefault(); 

    let monto = parseFloat(document.getElementById('monto').value);
    let interes = parseFloat(document.getElementById('interes').value);
    let años = parseInt(document.getElementById('años').value);

    if (isNaN(monto) || isNaN(interes) || isNaN(años)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingresa datos de préstamo válidos.',
        });
        return;
    }

    console.log('Monto:', monto);
    console.log('Interés:', interes);
    console.log('Años:', años);

    let tasaInteres = interes / 100 / 12;
    let pagosTotales = años * 12;

    let pagoMensual = (monto * tasaInteres) / (1 - Math.pow(1 + tasaInteres, -pagosTotales));

    let montoTotal = pagoMensual * pagosTotales;

    console.log('Pago Mensual:', pagoMensual);
    console.log('Monto Total:', montoTotal);

    guardarDatos({ monto, interes, años, pagoMensual, montoTotal });

    renderizarDatosGuardados();
}

function limpiarDatos() {
    document.getElementById('monto').value = '';
    document.getElementById('interes').value = '';
    document.getElementById('años').value = '';

    datosGuardados = {
        monto: '',
        interes: '',
        años: '',
        pagoMensual: 0,
        montoTotal: 0
    };

    localStorage.removeItem('datosPrestamo');
    renderizarDatosGuardados();
}

let cotizaciones = {
    blue: { compra: 0, venta: 0 },
    oficial: { compra: 0, venta: 0 },
    bolsa: { compra: 0, venta: 0 }
};

async function manejarCargaDeDatos() {
    try {

        renderizarDatosAPI(cotizaciones);
    } catch (error) {
        console.error('Error al cargar datos desde las APIs:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    manejarCargaDeDatos();
});

function verificarPropiedades(obj, props) {
    return props.reduce((acc, prop) => acc && obj && prop in obj ? obj[prop] : undefined, true);
}

function renderizarDatosAPI(datosBlue, datosOficial, datosBolsa) {
    let cotizacionesDiv = document.getElementById('cotizaciones');
    cotizacionesDiv.innerHTML = ''; 

    cotizacionesDiv.innerHTML += `<h3>Precio del Dólar Blue:</h3>`;

    if (verificarPropiedades(datosBlue, ['compra', 'venta'])) {
        const precioCompraBlue = datosBlue.compra;
        const precioVentaBlue = datosBlue.venta;

        cotizacionesDiv.innerHTML += `<p>Compra (Blue): ${precioCompraBlue}</p>`;
        cotizacionesDiv.innerHTML += `<p>Venta (Blue): ${precioVentaBlue}</p>`;
    } else {
        cotizacionesDiv.innerHTML += `<p>Datos no disponibles o formato inesperado para el dólar blue</p>`;
    }

    cotizacionesDiv.innerHTML += `<h3>Precio del Dólar Oficial:</h3>`;

    if (verificarPropiedades(datosOficial, ['datos', 'compra', 'venta'])) {
        const precioCompraOficial = datosOficial.datos.compra;
        const precioVentaOficial = datosOficial.datos.venta;
        cotizacionesDiv.innerHTML += `<p>Compra (Oficial): ${precioCompraOficial}</p>`;
        cotizacionesDiv.innerHTML += `<p>Venta (Oficial): ${precioVentaOficial}</p>`;
    } else {
        cotizacionesDiv.innerHTML += `<p>Datos no disponibles o formato inesperado para el dólar oficial</p>`;
    }

    cotizacionesDiv.innerHTML += `<h3>Precio del Dólar Bolsa:</h3>`;

    if (verificarPropiedades(datosBolsa, ['datos', 'compra', 'venta'])) {
        const precioCompraBolsa = datosBolsa.datos.compra;
        const precioVentaBolsa = datosBolsa.datos.venta;
        cotizacionesDiv.innerHTML += `<p>Compra (Bolsa): ${precioCompraBolsa}</p>`;
        cotizacionesDiv.innerHTML += `<p>Venta (Bolsa): ${precioVentaBolsa}</p>`;
    } else {
        cotizacionesDiv.innerHTML += `<p>Datos no disponibles o formato inesperado para el dólar bolsa</p>`;
    }
}
