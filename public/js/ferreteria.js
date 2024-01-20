const axios = require('axios');

async function obtenerDatosProducto (categoria){
    let response = await axios.get(`/producto/${categoria}`);
    return response.data;
}