const {Router} = require("express");
const multer = require('multer');

const pool = require('../bin/database');

const {isLogged, isNotLogged, isAdmin} = require('../util/auth')

const router = Router();

// Configuración de Multer para la carga de imágenes
const storage = multer.memoryStorage(); // Almacenar la imagen en memoria
const upload = multer({ storage: storage });

router.get('/', isLogged, async(req, res)=>{
    let productos = await pool.query('select * from Producto');
    for(let producto of productos){
        producto.imagen = producto.imagen.toString('base64');
    }
    /*
    let cantidadTotal = 0;
    let infoCarrito = await pool.query('select tipo, cantidad from Carrito as C inner join itemCarrito as IC on C.id = IC.id_carrito inner join Producto as P on IC.id_producto = P.id where estado = ? and id_usuario = ?', ['libre', req.user.usuario])
    if(infoCarrito.length > 0){
        for(let item of infoCarrito){
            cantidadTotal += item.cantidad;
        }   
    }*/
    res.render('producto/ver', {"productos": productos/*, "carrito": infoCarrito, 'cantidad': cantidadTotal*/});
});


module.exports = router;