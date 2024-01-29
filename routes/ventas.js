const {Router} = require('express');

const router = Router();
const pool = require('../bin/database');
const {isLogged} = require('../util/auth');

router.get('/panel',isLogged, async(req, res)=>{
    let productos = await pool.query('select id, tipo, marca, precio, stock from Producto');
    res.render('ventas/panel', {'productos': productos[0]});
});
router.post('/panel',isLogged, async(req, res)=>{
    let {productos} = req.body;
    req.session.productos = productos;
    res.redirect('/ventas/confirmar');
})

module.exports = router;