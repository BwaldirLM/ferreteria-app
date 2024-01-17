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

router.get('/detalle/:id', isLogged, async(req, res)=>{
    let {id} = req.params;
    let resultado = await pool.query('Select * from Producto where id = ?',[id]);
    resultado[0].imagen = resultado[0].imagen.toString('base64');
    res.render('producto/detalle',{"producto": resultado[0]});
});

router.get('/agregar',(req, res)=>{
    res.render('producto/agregar')
})

router.post('/agregar', async(req,res)=>{
    try {
        upload.single('imagen')(req, res, async (err) => {
          if (err instanceof multer.MulterError) {
            return res.status(400).send('Error al subir la imagen');
          } else if (err) {
            return res.status(500).send('Error interno del servidor');
          }
    
          const imagenSubida = req.file; // Acceder al archivo subido
          if (!imagenSubida) {
            return res.status(400).send('No se ha proporcionado una imagen');
          }
    
          const imagenContenido = imagenSubida.buffer; // Obtener el contenido de la imagen en bytes
          
          let datos = req.body;
          datos.imagen = imagenContenido;
          datos.mimetype = imagenSubida.mimetype;
            await pool.query('INSERT INTO Producto SET ?',[datos]);
          res.redirect('/producto');
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la imagen');
      }
    //await pool.query('INSERT INTO Mueble SET ?',[req.body]);
    //res.redirect('/mueble');
});

module.exports = router;