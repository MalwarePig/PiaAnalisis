const Controller = {};
const express = require('express'); //guardar express en una variable de servidor

///////// == Consumos == ////////////////////////////// == Consumos == ////////////////////////////// == Consumos == ////////////////////////// == Consumos == //////////////////// == Consumos == ///////////////////// == Consumos == /////// 
Controller.Consumos = (req, res) => {
    req.getConnection((err, conn) => {
        const {
            Variable
        } = req.params;
        var PlantaActual = Variable.split(' ')[0]; // "Fecha"
        var DepartamentoActual = Variable.split(' ')[1]; // "Fecha"
        var ProductoActual = Variable.split(' ')[2]; // "Fecha"
        //console.log("planta: " + PlantaActual + " Departamento: " +DepartamentoActual+  " ProductoActual: " + ProductoActual);
        conn.query("SELECT * FROM consumos WHERE Producto = '"+ProductoActual+"' AND Departamento = '"+DepartamentoActual+"' AND Planta = '"+PlantaActual+"'", (err, Consumos) => {
            if (err) {
                console.log('Error de lectura consumos');
            }
            res.json(Consumos);
        });
    });
};

///////// == Devoluciones == ////////////////////////////// == Devoluciones ===  
Controller.Devoluciones = (req, res) => {
    req.getConnection((err, conn) => {
        const {
            Variable
        } = req.params;
        var PlantaActual = Variable.split(' ')[0]; // "Fecha"
        var DepartamentoActual = Variable.split(' ')[1]; // "Fecha"
        var ProductoActual = Variable.split(' ')[2]; // "Fecha"
        conn.query("SELECT * FROM devoluciones WHERE Producto = '"+ProductoActual+"' AND Departamento = '"+DepartamentoActual+"' AND Planta = '"+PlantaActual+"'", (err, Devoluciones) => {
            if (err) {
                console.log('Error de lectura Devoluciones');
            }
            res.json(Devoluciones);
        });
    });
};

///////// == Productos == ////////////////////////////// == Productos == ////////////////////////////// == Productos === 
Controller.Productos = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM producto", (err, Productos) => {
            if (err) {
                console.log('Error de lectura productos');
            }
            res.json(Productos);
        });
    });
};

Controller.ProductoActual = (req, res) => {
    req.getConnection((err, conn) => {
        const {
            Producto
        } = req.params;
        conn.query("SELECT * FROM producto where Producto = '" + Producto + "'", (err, Productos) => {
            if (err) {
                console.log('Error de lectura productos');
            }
            res.json(Productos);
        });
    });
};


Controller.ListaProductos = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("call ListaProductos();", true, (err, rows, fields) => {
            if (err) {
                console.log('Error al descontar almacen' + err);
            }
            res.json(rows);
            //console.table(fields);
        });
    });
};




module.exports = Controller;