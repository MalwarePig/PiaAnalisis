const express = require('express'); //guardar express en una variable de servidor
const router = express.Router(); //usar modulo de router de ex´press
const ReporteController = require('../Controller/ReporteController');

/////////////////////////////////////////////////////////////////////////// USUARIOS /////////////////////////////////////////////////////////////////////////////////
//Acceder a login
var reinicio = router.get('/', (req, res) => {
	//res.send('holoo');
	res.render('index.html');
});

//Consultar Consumos
router.get('/Consumos/:Variable', ReporteController.Consumos);
//Consultar Devoluciones
router.get('/Devoluciones/:Variable', ReporteController.Devoluciones);
//Consultar Productos
router.get('/Productos', ReporteController.Productos);
//Consultar Productos
router.get('/ListaProductos', ReporteController.ListaProductos);

//Consultar Producto actual
router.get('/ProductoActual/:Producto', ReporteController.ProductoActual);
 
//Consultar Plantas
router.get('/Planta/', ReporteController.Planta);
//Consultar Plantas
router.get('/Departamento/', ReporteController.Departamento);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
