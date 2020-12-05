var A_Consumos = [];
var A_Devoluciones = [];
var A_Productos = [];
var TotalProductos = 0;
var TotalDevoluciones = 0;
var TotalConsumos = 0;
var ListaProductos = [];
 
var ArchivoPlantas = [];

var A_Plantas = ['PP1','PP2','PP3'];
var TotalPlantas = A_Plantas.length;
var A_Departamento = ['DD1111','DD2222','DD3333'];
var TotalDepartamentos = A_Departamento.length;
var PlantaUno = [];
//Plantas = 2
//Departamento = 2
/*
function LeeConsumos() {
    $.ajax({
        url: '/Consumos/',
        success: function (Consumos) {
            TotalConsumos = Consumos.length;
            alert(TotalConsumos);
            for(var i = 0; i < TotalConsumos; i++){
                var Clave_Reporte = Consumos[i].Clave_Reporte;
                var Planta = Consumos[i].Planta;
                var Departamento = Consumos[i].Departamento;
                var Producto = Consumos[i].Producto;
                var cantidadC = Consumos[i].cantidadC;
                var Arreglo = [Clave_Reporte,Planta,Departamento,Producto,cantidadC];
                A_Consumos.push(Arreglo);
            }
        } //Funcion success
    }); //Ajax
}*/



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
            // console.table({ Productos});
        } //Funcion success
    }); //Ajax
}

function LeerLista() {
    $.ajax({
        url: '/ListaProductos/',
        success: function (Productos) {
           TotalProductos = Productos[0].length;
           for (let index = 0; index < TotalProductos; index++) {
            var Producto = Productos[0][index].Producto;
            var Arreglo = [Producto];
            ListaProductos.push(Arreglo);
           }
            //console.table(ListaProductos);
        } //Funcion success
    }); //Ajax
}

(function () {
    //LeerLista();
    setTimeout("LeerLista()", 1000);
    setTimeout("Comparar()", 2000);
    setTimeout("Mostrar()", 3000);
    setTimeout("MostrarPlantas()", 4000);
    /*LeeConsumos();
    LeeDevoluciones();
    LeeProducto();*/
})();

function Alerta(){
    alert("Alerta");
}

function Comparar() {

 
    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
            var ArchivoDepartamentos = [];
            for (let index = 0; index < TotalProductos; index++) {
                //var ProductoActual = ListaProductos[index];//Se obtiene el primer producto de la lista de los 2 reportes
                //console.log( index + " - " +ProductoActual);
                $.ajax({
                    url: '/ProductoActual/'+ListaProductos[index],//Se busca el producto en la tabla reportes
                    success: function (Productos) {
                        if(Productos.length > 0){
                            //console.table(Productos);//se Obtiene el resultado
                                ////////////////// Consumos ///////////////////////
                                $.ajax({
                                    url: '/Consumos/'+ A_Plantas[p] + ' ' +  A_Departamento[d] + ' ' + ListaProductos[index],
                                    success: function (Consumos) {
                                        if(Consumos.length > 0){
                                            for(var i = 0; i < Consumos.length; i++){
                                                var Clave_Reporte = Consumos[i].Clave_Reporte;
                                                var Planta = Consumos[i].Planta;
                                                var Departamento = Consumos[i].Departamento;
                                                var Producto = Consumos[i].Producto;
                                                var cantidadC = Consumos[i].cantidadC;
                                                var Des_Productos = Productos[0].info;
                                                var importe = Productos[0].importe;
                                                var Fila = [Des_Productos, importe, Clave_Reporte, Planta,Departamento,Producto,cantidadC];  

                                                A_Consumos.push(Fila);                              
                                            }
                                        }
                                    } //Funcion success
                                }); //Ajax
                                
                               //console.log("Indice Planta: " +p + " Planta: " + A_Plantas[p] + " Indice Departamento: " + d +" Departamento: " + A_Departamento[d] + " Indice Producto: " + index + " Producto:  " +ListaProductos[index]);
                                ////////////////// Consumos ///////////////////////
                        }else{//Sin producto encontrado en tabla Productos
                            alert("Sin coincidencias en tabla productos " + ProductoActual);
                        }
                    }//Funcion success
                }); //Ajax
            }//For Productos
        }//For Departamentos
    }//For Plantas
}

function Mostrar(){
    console.log(A_Consumos.length);

    for (let index = 0; index < A_Consumos.length; index+=2) {
        //console.log(A_Consumos[index]);
        //console.log("Cod_Producto: " +A_Consumos[index][5] + " Des_Producto: " + A_Consumos[index][0]+ " Consumo: " + A_Consumos[index][6] + " Importe: " + A_Consumos[index][1] + " Consumo: " + A_Consumos[index+1][6] + " importe: " + A_Consumos[index+1][1]);
        $.ajax({
            url: '/Devoluciones/' + A_Consumos[index][3] + " " + A_Consumos[index][4] + " " + A_Consumos[index][5],
            success: function (Devoluciones) {
                if(Devoluciones.length>0){
                   // console.table(Devoluciones);
                    if( (Devoluciones[0].Planta == A_Consumos[index][3]) && (Devoluciones[0].Departamento == A_Consumos[index][4]) && (Devoluciones[0].Producto == A_Consumos[index][5])){
                        //console.log("Reporte: " + A_Consumos[index][2]+" Planta: " +A_Consumos[index][3] + " Departamento: "+ A_Consumos[index][4] + " Cod_Producto: " +A_Consumos[index][5] + " Des_Producto: " + A_Consumos[index][0]+ " Consumo: " + A_Consumos[index][6] + " Importe: " + A_Consumos[index][1] + " Reporte: " + A_Consumos[index+1][2] + " Consumo: " + Devoluciones[0].cantidadC + " importe: " + A_Consumos[index+1][1]);
                        if(A_Consumos[index][3] === 'PP1' && Devoluciones[0].Planta == A_Consumos[index][3]){
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
                                importe: ( Devoluciones[0].cantidadC * A_Consumos[index+1][1] )
                            }
                           // var lista = [A_Consumos[index][2],A_Consumos[index][3],A_Consumos[index][4],A_Consumos[index][5],A_Consumos[index][0],A_Consumos[index][6], A_Consumos[index][1],A_Consumos[index+1][2], Devoluciones[0].cantidadC,A_Consumos[index+1][1]];
                            PlantaUno.push(Fila);
                        }

                    }
                }
                //console.table(Devoluciones);
            } //Funcion success
        }); //Ajax
    }
}

function MostrarPlantas ( ) {
    console.table(PlantaUno);
}














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