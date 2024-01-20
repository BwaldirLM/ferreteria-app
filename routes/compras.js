const {Router} = require('express');

const pool = require('../bin/database');

const router = Router();

router.get('/', async(req, res)=>{
    let compras = await pool.query('Select V.id, sum(Cantidad) as CantidadTotal, sum(Precio) as PrecioTotal, fecha from Venta as V inner join DetalleVenta as DV on V.id = DV.id_venta inner join Producto as P on DV.id_producto = P.id where id_usuario = ? group by V.id, Fecha;', [req.user.DNI]);
    console.log(compras);
    res.render('compras/ver', {'compras': compras[0]});
});

router.get('/:id/detalle', async(req, res) => {
    let {id} = req.params;
    let detalles = await pool.query('select id_producto as id, cantidad, tipo, categoria, precio from DetalleVenta DV inner join Producto P on DV.id_producto = P.id where id_venta= ?;',[id]);
    res.json(detalles[0]);
});

module.exports = router;