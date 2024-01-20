const {Router} = require('express');
const pool = require('../bin/database');

const {isLogged, isNotLogged} = require('../util/auth')



const router = Router();

router.get('/',isLogged,async(req, res)=>{
    let carrito = await pool.query('select imagen, mimetype, cantidad, tipo, precio, cantidad*Precio as precio_total from Carrito as C inner join ItemCarrito  as IC on C.id = IC.id_carrito inner join Producto as P on IC.id_producto = P.id where estado = ? and id_usuario = ?', ['libre',req.user.DNI]);
    let totalPago = 0;
    for(let item of carrito[0]){
        item.imagen = item.imagen.toString('base64');
        totalPago += item.precio*item.cantidad;
    }
    res.render('carrito/ver', {'carrito':carrito[0], 'total': totalPago});
});

router.post('/', isLogged, async(req, res)=>{
    const consulta = `SELECT usuario, id_producto, cantidad FROM Persona P INNER JOIN Carrito C ON P.DNI = C.id_usuario  INNER JOIN ItemCarrito IC ON C.id = IC.id_carrito WHERE P.DNI= ? and C.estado = 'libre';`;
    let productos = await pool.query(consulta, [req.user.DNI])
    let carrito = await pool.query('select id from Carrito where estado = ? and id_usuario = ?', ['libre',req.user.DNI])

    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    let venta =  await pool.query(`INSERT INTO Venta(id_usuario, id_carrito, fecha) Values(?,'?',?)`,[req.user.DNI, carrito[0][0].id, fechaFormateada]);
    for (const m of productos[0]) {
        
        let {id_producto, cantidad} = m;
        await pool.query('Insert into DetalleVenta values(?,?,?)',[id_producto, venta[0].insertId, cantidad]);
        let stock = await pool.query('select stock from Producto where id = ?',[id_producto]);
        let stockActualizado = stock[0][0].stock-cantidad;
        await pool.query('update Producto set stock = ? where id = ?',[stockActualizado, id_producto]);
    }
    await pool.query(`update Carrito set estado = 'vendido' where id = ?`,[carrito[0][0].id]);
    
    res.redirect('/index');
});

module.exports = router;