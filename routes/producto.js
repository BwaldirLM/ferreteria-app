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
    for(let producto of productos[0]){
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
    res.render('producto/ver', {"productos": productos[0]/*, "carrito": infoCarrito, 'cantidad': cantidadTotal*/});
});

router.get('/detalle/:id', isLogged, async(req, res)=>{
    let {id} = req.params;
    let resultado = await pool.query('Select * from Producto where id = ?',[id]);
    resultado[0][0].imagen = resultado[0][0].imagen.toString('base64');
    res.render('producto/detalle',{"producto": resultado[0][0]});
});

router.post('/detalle/:id',isLogged, async(req, res)=>{
  const {cantidad} = req.body;
  let {id} = req.params;
  let usuario_id = req.user.DNI;
  if(cantidad > 0){
      let carritoLibre = await pool.query('select * from Carrito where estado = ? and id_usuario = ?', ['libre', usuario_id])
      if(carritoLibre[0].length > 0){
          let id_carrito = carritoLibre[0][0].id;
          let item =await pool.query('SELECT * FROM ItemCarrito WHERE id_carrito = ? AND id_producto = ?', [id_carrito, id]);
          if(item[0].length > 0){
              const cantidadActualizada = parseInt(item[0][0].cantidad) + parseInt(cantidad);
              await pool.query('UPDATE ItemCarrito SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?', [cantidadActualizada, id_carrito, id]);
          }
          else{
              await pool.query('insert into ItemCarrito (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)',[id_carrito, id, cantidad]);
          }               
      }
      else{
          let carrito = await pool.query('INSERT INTO Carrito (id_usuario) VALUES (?)', [usuario_id]);
          let id_carrito = carrito[0].insertId;
          await pool.query('insert into ItemCarrito (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)',[id_carrito, id, cantidad]);       

      }

  }
  
  res.redirect('/producto')
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

router.get('/:categoria',async (req, res)=>{
  let {categoria} = req.params;
  let resultado = await pool.query('SELECT * FROM Producto WHERE categoria = ?', [categoria]);
  for (let producto of resultado[0]) {
    producto.imagen = producto.imagen.toString('base64');
  }
res.json(resultado[0]);
});

module.exports = router;