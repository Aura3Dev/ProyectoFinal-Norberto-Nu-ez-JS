// ajax-handler.js

function cargarDatosDesdeJSON() {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

cargarDatosDesdeJSON();
