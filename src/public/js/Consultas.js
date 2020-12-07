var A_Consumos = [];
var A_Devoluciones = [];
var A_Productos = [];
var TotalProductos = 0;
var TotalDevoluciones = 0;
var TotalConsumos = 0;
var ListaProductos = [];

ArchivoBruto = [];

var ArchivoPlantas = [];

var A_Plantas = ['PP1','PP2','PP3'];
var TotalPlantas = A_Plantas.length;
var A_Departamento = ['DD1111','DD2222','DD3333'];
var TotalDepartamentos = A_Departamento.length;
var PlantaUno = [];

(function () {
    setTimeout("LeerLista()", 2000);//Leer todos los productos existentes en los 2 reportes
    setTimeout("Comparar()", 3000);
    setTimeout("Devoluciones()", 5000);
    setTimeout("Empresa()", 9000);
})();

function ConsultaTabla(){
    $.ajax({
        url: '/Planta/' + A_Plantas[p],
        success: function (NombrePlanta) {
            $.ajax({
                url: '/Departamento/' +A_Plantas[p] + " " + A_Departamento[d],
                success: function (NombreDepartamento) {
                            alert("Nombre: " + NombrePlanta[0].Nombre + " Departamento: " + NombreDepartamento[0].Nombre);
                       } //Funcion success
            }); //Ajax
               } //Funcion success
    }); //Ajax
}

function ConsultaAreas(){
    $.ajax({
        url: '/ProductoActual/'+ProductoActual,//Se busca el producto en la tabla reportes
        success: function (Productos) {
            if(Productos.length > 0){
                console.log("Prodcuto: " + ProductoActual + " Planta: " + PlantaActual + " Departamento: " +DepartamentoActual);
                Consumos(ProductoActual, PlantaActual, DepartamentoActual, Productos[0].info, Productos[0].importe);//Crea tabla Producto+Consumos
            }else{//Sin producto encontrado en tabla Productos
                alert("Sin coincidencias en tabla productos " + ProductoActual);
            }
        }//Funcion success
    }); //Ajax   
}

function LeerLista() {//Lee la lista de productos de ambos archivos
    $.ajax({
        url: '/ListaProductos/',
        success: function (Productos) {
           TotalProductos = Productos[0].length;
           for (let index = 0; index < TotalProductos; index++) {
            var Producto = Productos[0][index].Producto;
            var Arreglo = [Producto];
            ListaProductos.push(Arreglo);
           }
        } //Funcion success
    }); //Ajax
}

function Comparar() {
    console.log(TotalProductos);
    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
            for (let index = 0; index < TotalProductos; index++) {
                VerificarProducto(ListaProductos[index], A_Plantas[p], A_Departamento[d]);//Verifica la existencia del producto actual en la tabla productos
            }//For Productos
        }//For Departamentos
    }//For Plantas
}

function VerificarProducto(ProductoActual, PlantaActual, DepartamentoActual){//Verifica la existencia del producto actual en la tabla productos
    $.ajax({
        url: '/ProductoActual/'+ProductoActual,//Se busca el producto en la tabla reportes
        success: function (Productos) {
            if(Productos.length > 0){
                //.log("Prodcuto: " + ProductoActual + " Planta: " + PlantaActual + " Departamento: " +DepartamentoActual);
                Consumos(ProductoActual, PlantaActual, DepartamentoActual, Productos[0].info, Productos[0].importe);//Crea tabla Producto+Consumos
            }else{//Sin producto encontrado en tabla Productos
                alert("Sin coincidencias en tabla productos " + ProductoActual);
            }
        }//Funcion success
    }); //Ajax
}

function Consumos(ProductoActual, PlantaActual, DepartamentoActual, Prod_Info, Prod_Importe){//Crea tabla Producto+Consumos
    $.ajax({
        url: '/Consumos/'+ ProductoActual + ' ' +  PlantaActual + ' ' + DepartamentoActual,
        success: function (Consumos) {
            if(Consumos.length > 0){
                if((Consumos[0].Planta == PlantaActual) && (Consumos[0].Departamento == DepartamentoActual) && (Consumos[0].Producto == ProductoActual)){
                    for(var i = 0; i < Consumos.length; i++){
                        var Clave_Reporte = Consumos[i].Clave_Reporte;
                        var Planta = Consumos[i].Planta;
                        var Departamento = Consumos[i].Departamento;
                        var Producto = Consumos[i].Producto;
                        var cantidadC = Consumos[i].cantidadC;
                       
                        var Fila = [Prod_Info, Prod_Importe, Clave_Reporte, Planta,Departamento,Producto,cantidadC];  
                        A_Consumos.push(Fila);                              
                    }
                }
            }
        } //Funcion success
    }); //Ajax
}

function Devoluciones(){
    for (let index = 0; index < A_Consumos.length; index+=2) {
        $.ajax({
            url: '/Devoluciones/' + A_Consumos[index][3] + " " + A_Consumos[index][4] + " " + A_Consumos[index][5],
            success: function (Devoluciones) {
                if(Devoluciones.length>0){//Si encontró hace operaciones

                    var Fila = {
                        Cod_Producto: A_Consumos[index][0],
                        Nom_Producto: A_Consumos[index][5],
                        TipoR: A_Consumos[index][2],
                        PlantaC: A_Consumos[index][3],
                        DepartamentoC: A_Consumos[index][4],
                        ConsumoC: (A_Consumos[index][6] - Devoluciones[0].cantidadC),
                        ImporteC: ((A_Consumos[index][6] - Devoluciones[0].cantidadC) * A_Consumos[index][1]),
                        PlantaD: Devoluciones[0].Planta,
                        DepartamentoD: Devoluciones[0].Departamento,
                        ConsumoD: A_Consumos[(index+1)][6],
                        importeD:(A_Consumos[(index+1)][6] * A_Consumos[index][1]),
                        ConsumosDif : Math.abs(((A_Consumos[index][6] - Devoluciones[0].cantidadC)) - (A_Consumos[(index+1)][6])),
                        importeDif: (Math.abs(((A_Consumos[index][6] - Devoluciones[0].cantidadC)) - (A_Consumos[(index+1)][6])) * A_Consumos[index][1]),
                        a_Favor: (A_Consumos[index][6] - Devoluciones[0].cantidadC) > (A_Consumos[(index+1)][6]) ? 'Almacen' : 'Produccion'
                    }
                    PlantaUno.push(Fila);
                }else{
                    var Fila = {
                        Cod_Producto: A_Consumos[index][0],
                        Nom_Producto: A_Consumos[index][5],
                        TipoR: A_Consumos[index][2],
                        PlantaC: A_Consumos[index][3],
                        DepartamentoC: A_Consumos[index][4],
                        ConsumoC: A_Consumos[index][6],
                        ImporteC: A_Consumos[index][6] * A_Consumos[index][1],
                        PlantaD: '',
                        DepartamentoD: '',
                        ConsumoD: A_Consumos[(index+1)][6],
                        importeD:(A_Consumos[(index+1)][6] * A_Consumos[index][1]),
                        ConsumosDif : Math.abs((A_Consumos[index][6]) - (A_Consumos[(index+1)][6])),
                        importeDif: (Math.abs((A_Consumos[index][6]) - (A_Consumos[(index+1)][6])) * A_Consumos[index][1]),
                        a_Favor: (A_Consumos[index][6]) > (A_Consumos[(index+1)][6]) ? 'Almacen' : 'Produccion'
                    }
                 
                    PlantaUno.push(Fila);
                }
            } //Funcion success
        }); //Ajax
    }//For consumos
}

function Empresa(){
    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        var Hoja = 0;
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
            var TotalImporte_Alm = 0;
            var TotalImporte_Pro = 0;
            var FavorAlmacen = 0;
            var FavorPro = 0;
            var Dep_Actual = '';
          
            for(var index = 0 ;index < PlantaUno.length;index++ ){
                if((PlantaUno[index].PlantaC == A_Plantas[p]) && (PlantaUno[index].DepartamentoC == A_Departamento[d])){//Si la planta y derpartamento coinciden en el recorrido del registro actua

                    console.table(PlantaUno[index]); 
                    if(Dep_Actual != PlantaUno[index].DepartamentoC){//Se identifica el cambio de departamento para incrementar hoja
                        Hoja++;
                        Dep_Actual =  PlantaUno[index].DepartamentoC;
                    }
                    TotalImporte_Alm = TotalImporte_Alm + PlantaUno[index].ImporteC;
                    TotalImporte_Pro = TotalImporte_Pro + PlantaUno[index].importeD;
                    if(PlantaUno[index].a_Favor == 'Produccion'){//Incrementa El importe a favor de Produccion o almacen
                        FavorPro = FavorPro + PlantaUno[index].importeDif;
                    }else if(PlantaUno[index].a_Favor == 'Almacen'){
                        FavorAlmacen = FavorAlmacen + PlantaUno[index].importeDif;
                    }
                }//Fin IF Principal
            }//Recorre la tabla maestra
            console.log("Almacen Importe: " + TotalImporte_Alm + " Almacen Produccion: " + TotalImporte_Pro + " FavorAlmacen: "+ FavorAlmacen + " FavorPro: "+ FavorPro + " Hoja: "+ Hoja);
        }
    }
}



/*
function MostrarPlantas ( ) {
    console.table(PlantaUno);
}


   $.ajax({
        url: '/Devoluciones/' + Planta + " " + Departamento + " " + Producto,
        success: function (Devoluciones) {
               } //Funcion success
    }); //Ajax

function ConsultaDevoluciones(Planta, Departamento, Producto){
    $.ajax({
        url: '/Devoluciones/' + Planta + " " + Departamento + " " + Producto,
        success: function (Devoluciones) {
          console.log("idice dentro de la consulta: " +index);
            if(Devoluciones.length>0){
               //console.log("Planta: " +  A_Consumos[index][3]+ " Departamento: "+ A_Consumos[index][4] + " Productos: "+ A_Consumos[index][5] )
               //console.table(Devoluciones);
                //if( (Devoluciones[0].Planta == A_Consumos[index][3]) && (Devoluciones[0].Departamento == A_Consumos[index][4]) && (Devoluciones[0].Producto == A_Consumos[index][5])){
               
                    var Fila = {
                        Reporte: A_Consumos[index][2],
                        Planta: A_Consumos[index][3],
                        Departamento: A_Consumos[index][4],
                        Cod_Producto: A_Consumos[index][5],
                        Des_Producto: A_Consumos[index][0],
                        Consumo: (A_Consumos[index][6] - (Devoluciones[0].cantidadC || 0)),
                        Importe: (A_Consumos[index][6] - (Devoluciones[0].cantidadC || 0)) * A_Consumos[index][1],
                        Reporte: A_Consumos[index+1][2] || 'NA',
                        Consumo: Devoluciones[0].cantidadC,
                        importe: ( Devoluciones[0].cantidadC * A_Consumos[index+1][1] ),
                        indice: index
                    }
                   // var lista = [A_Consumos[index][2],A_Consumos[index][3],A_Consumos[index][4],A_Consumos[index][5],A_Consumos[index][0],A_Consumos[index][6], A_Consumos[index][1],A_Consumos[index+1][2], Devoluciones[0].cantidadC,A_Consumos[index+1][1]];
                    PlantaUno.push(Fila);
            }
            //console.table(Devoluciones);
        } //Funcion success
    }); //Ajax
}



*/







/**
 
        $.ajax({
            url: '/Devoluciones/' + A_Consumos[index][3] + " " + A_Consumos[index][4] + " " + A_Consumos[index][5],
            success: function (Devoluciones) {
              console.log("idice dentro de la consulta: " +index);
                if(Devoluciones.length>0){
                   /*console.log("Planta: " +  A_Consumos[index][3]+ " Departamento: "+ A_Consumos[index][4] + " Productos: "+ A_Consumos[index][5] )
                   console.table(Devoluciones);
                    //if( (Devoluciones[0].Planta == A_Consumos[index][3]) && (Devoluciones[0].Departamento == A_Consumos[index][4]) && (Devoluciones[0].Producto == A_Consumos[index][5])){
                   
                        var Fila = {
                            Reporte: A_Consumos[index][2],
                            Planta: A_Consumos[index][3],
                            Departamento: A_Consumos[index][4],
                            Cod_Producto: A_Consumos[index][5],
                            Des_Producto: A_Consumos[index][0],
                            Consumo: (A_Consumos[index][6] - (Devoluciones[0].cantidadC || 0)),
                            Importe: (A_Consumos[index][6] - (Devoluciones[0].cantidadC || 0)) * A_Consumos[index][1],
                            Reporte: A_Consumos[index+1][2] || 'NA',
                            Consumo: Devoluciones[0].cantidadC,
                            importe: ( Devoluciones[0].cantidadC * A_Consumos[index+1][1] ),
                            indice: index
                        }
                       // var lista = [A_Consumos[index][2],A_Consumos[index][3],A_Consumos[index][4],A_Consumos[index][5],A_Consumos[index][0],A_Consumos[index][6], A_Consumos[index][1],A_Consumos[index+1][2], Devoluciones[0].cantidadC,A_Consumos[index+1][1]];
                        PlantaUno.push(Fila);
                }
                //console.table(Devoluciones);
            } //Funcion success
        }); //Ajax
 */












function Invertido(){
    var A_Plantas = ['PP1','PP2','PP3'];
    var TotalPlantas = A_Plantas.length;
    var A_Departamento = ['DD1111','DD2222','DD3333'];
    var TotalDepartamentos = A_Departamento.length;
    var ArchivoDepartamentos = [];
    var ArchivoPlantas = [];
    for (let index = 0; index < TotalProductos; index++) {
        //var ProductoActual = ListaProductos[index];//Se obtiene el primer producto de la lista de los 2 reportes
        //console.log( index + " - " +ProductoActual);
        $.ajax({
            url: '/ProductoActual/'+ListaProductos[index],//Se busca el producto en la tabal reportes
            success: function (Productos) {
                if(Productos.length > 0){
                    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
                        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
                          //console.log("Indice Planta: " +p + " Planta: " + A_Plantas[p] + " Indice Departamento: " + d +" Departamento: " + A_Departamento[d] + " Indice Producto: " + index + " Producto:  " +ListaProductos[index]);
                         
                          var FilaDepartamento = {
                            Planta : A_Plantas[p],
                            Departamento : A_Departamento[d],
                            Producto : ListaProductos[index] 
                          }
                          ArchivoDepartamentos.push(FilaDepartamento);
                        }
                        ArchivoPlantas.push(ArchivoDepartamentos);
                    }
                      ////////////////// Consumos ///////////////////////                        
                      // console.log("Indice Planta: " +p + " Planta: " + A_Plantas[p] + " Indice Departamento: " + d +" Departamento: " + A_Departamento[d] + " Indice Producto: " + index + " Producto:  " +ListaProductos[index]);
                        ////////////////// Consumos ///////////////////////
                }else{//Sin producto encontrado en tabla Productos
                    alert("Sin coincidencias en tabla productos " + ProductoActual);
                }
            }//Funcion success
        }); //Ajax
    }
    console.table(ArchivoPlantas);
   
}



function LeeProducto() {
    $.ajax({
        url: '/Productos/',
        success: function (Productos) {
           TotalProductos = Productos.length;
           for (let index = 0; index < TotalProductos; index++) {
            var Producto = Productos[index].Producto;
            var NombreP = Productos[index].info;
            var importe = Productos[index].importe;
            var Arreglo = [Producto,NombreP,importe];
            A_Productos.push(Arreglo);
           }
        } //Funcion success
    }); //Ajax
}


//clave de reporte,planta,departamento,+
/*
    console.log(A_Consumos[0][0]);
    console.info( A_Consumos[0].includes( 'PP1111' ) ); // true
    console.info( A_Consumos[0].includes( 'PP1111' ) ); // true
    console.info( A_Consumos[0].includes( 'PP1111' ) ); // true
    
    /*
    var TotalPlantas = 2;
    var TotalDepartamentos = 2;
    var sheet_1_data = [];
    for (var i_Planta = 0; i_Planta < TotalPlantas; i_Planta++) {//For Plantas

       // console.log("Total: " + Object.values(A_Devoluciones[0])[0].Planta ) ;
       // console.log("Total: " + A_Devoluciones[0][0].cantidadC ) ;
       var Arreglo={
         Planta : A_Devoluciones[0][i_Planta].Planta,
         Departamento : A_Devoluciones[0][i_Planta].Departamento,
         Producto : A_Devoluciones[0][i_Planta].Producto,
         CantidadC : A_Devoluciones[0][i_Planta].cantidadC
       }
        
        //var Arreglo = [Planta,Departamento,Producto,CantidadC];
        console.table(Arreglo);
        sheet_1_data.push(Arreglo);
    }//For Plantas
    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("ReporteArticulo.xlsx",?) FROM ?', [opts, [sheet_1_data]]);*/
       /*
    
function Comparar() {
    var A_Plantas = ['PP1','PP2','PP3'];
    var TotalPlantas = A_Plantas.length;
    var A_Departamento = ['DD1111','DD2222','DD3333'];
    var TotalDepartamentos = A_Departamento.length;
    var Tabla = [];
    for (let index = 0; index < TotalProductos; index++) {
       // console.log(A_Productos[index][0]);
        var ProductoActual = A_Productos[index][0];
        for (let p = 0; p < TotalPlantas; p++) {
            var nombre_Planta = A_Plantas[p];
            for (let d = 0; d < TotalDepartamentos; d++) {
                var nombre_Departamento = A_Departamento[d];
                    for (let c = 0; c < TotalConsumos; c++) {
                       // console.info("Planta: "+ A_Consumos[c].includes( 'PP1' ) + " Departamento: " + A_Consumos[c].includes( 'DD1111' ) + " Producto : " + A_Consumos[c].includes( 'PP1111' )); // true          
                        if((A_Consumos[c].includes( nombre_Planta ) == true) && (A_Consumos[c].includes( nombre_Departamento ) == true ) && (A_Consumos[c].includes( ProductoActual ) == true)){
                          
                            var Comparacion = [];
                            Comparacion = Match(nombre_Planta, nombre_Departamento, ProductoActual);
                           
                            var Fila = {
                                Clave_Prod : nombre_Planta,
                                Departamento : nombre_Departamento,
                                Nombre: ProductoActual,
                                RA_Nombre: '',	
                                RA_Consumo : '',	
                                RP_importe	: '',
                                RP_Consumo : '',	
                                importe: '',
                            }
                           Tabla.push(Fila);
                        }
                    }//For Consumos
            }//For Departamentos
        }//For Plantas
    }//For Productos
   console.table(Tabla);
}

    */








    //Lee tablas
    //Lee Productos
    //Lee Archivo Consumos
    //Lee Archivo Devoluciones
    

    //INICIO
    //Lees consumos
    //----Registro1
    //   claveReporte  Planta  Dpto   producto cantC

    // Lees devoluciones
    //--- Registro1
    //   PLanta Dpto producto CantD


