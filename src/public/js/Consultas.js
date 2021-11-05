 /**
* Programa: COP120
* Nombre: Miranda Mateos Jennifer Arleth
* Nombre: López Díaz Soledad
* Fecha: 06/12/2020.
* @Description:  Generar Reporte Comparativo de Consumos y Devoluciones por Planta, Departamento *  y Producto bajo estándares de JavaScript
    */

/**
 * @fileoverview Consultas.js
 * @description 
 */
var A_Consumos = [];
var A_Devoluciones = [];
var A_Productos = [];
var TotalProductos = 0;
var TotalDevoluciones = 0;
var TotalConsumos = 0;
var ListaProductos = [];
ArchivoBruto = [];
var ArchivoPlantas = [];
var A_Plantas = [];
var TotalPlantas = 0;
var A_Departamento = [];
var A_DepartamentoInfo = [];
var TotalDepartamentos = A_Departamento.length;
var PlantaUno = [];

//********************************  ******************************* */
/**
* @description     // 
* @fileoverview    //  
* @function Leer Productos
* @function Leer Tablas
* @function Leer Consumos
* @function Leer devolucioens
 */

(function () {

    setTimeout("ConsultaTabla()", 2000);
    setTimeout("LeerLista()", 3000);//Leer todos los productos existentes en los 2 reportes
    setTimeout("Comparar()", 5000);
    setTimeout("Devoluciones()", 7000);
    setTimeout("Empresa()", 9000);
    //setTimeout("PDF()", 1000);
})();
//************************************ LEE TABLA ******************************* */
/**
 * @function ConsultaTabla  >> LEE TABLAS
 * @description   Consulta la tabla tablas 
 * y obtiene los valores de Planta, Dpto y Fecha 
 */

function ConsultaTabla(){
    $.ajax({
        url: '/Planta/',
        success: function (Plantas) {
            for(var p = 0;p < Plantas.length; p++){
                var inforPlanta = {
                    LlaveTabla : Plantas[p].LlaveTabla,
                    Nombre : Plantas[p].Nombre
                }
                A_Plantas.push(inforPlanta);
            }
            TotalPlantas =  A_Plantas.length;
        } //Funcion success
    }); //Ajax

    $.ajax({
        url: '/Departamento/',
        success: function (Departamento) {
            var A_DepartamentoRepetido = [];//Arreglo Provisional
            for(var d = 0;d < Departamento.length; d++){
                var inforDepartamento = {
                    LlaveTabla : Departamento[d].LlaveTabla,
                    Nombre : Departamento[d].Nombre
                }
                A_DepartamentoRepetido.push(Departamento[d].LlaveTabla.slice(-6));
                A_DepartamentoInfo.push(inforDepartamento);
            }
 
            //console.log("Con repetidos es:", A_DepartamentoRepetido);
            A_Departamento = [...new Set(A_DepartamentoRepetido)];
            //console.log("Sin repetidos es:", A_Departamento);

            TotalDepartamentos =  A_Departamento.length;
        } //Funcion success
    }); //Ajax
}

/**
 * @function ConsultaAreas  >> Producto existe en la BD
 * @description   Si IdProductoLei existe en la Base
 * de datos generar el detalle si no Aborta el programa 
 */
function ConsultaAreas(){
    $.ajax({
        url: '/ProductoActual/'+ProductoActual,//Se busca el producto en la tabla reportes
        success: function (Productos) {
            if(Productos.length > 0){
                //console.log("Prodcuto: " + ProductoActual + " Planta: " + PlantaActual + " Departamento: " +DepartamentoActual);
                Consumos(ProductoActual, PlantaActual, DepartamentoActual, Productos[0].info, Productos[0].importe);//Crea tabla Producto+Consumos
            }else{//Sin producto encontrado en tabla Productos
                alert("Sin coincidencias en tabla productos " + ProductoActual);
            }
        }//Funcion success
    }); //Ajax   
}
/**
 * @function LeerLista  >> Lee Consumos y Devoluciones
 * @description  Verifica que Id producto existe en Consumos y devoluciones
 */
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

/********************** CONTROL ******************************** */
function Comparar() {
    console.log("TotalPrpoductos: " + TotalProductos+ " Plantas: " +TotalPlantas + " Departamentos: "+ TotalDepartamentos);

    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
            for (let index = 0; index < TotalProductos; index++) {
                VerificarProducto(ListaProductos[index], A_Plantas[p].LlaveTabla, A_Departamento[d]);//Verifica la existencia del producto actual en la tabla productos
            }//For Productos
        }//For Departamentos
    }//For Plantas
}
/***************** Existe en la tabla PRoductos de la DB */
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
/******************************** LEE CONSUMOS ***************************************** */
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
/******************************** PROCESA PRODUCTO  ******************************************* */
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
/*********************************** A C M U L A D O R ***************** */
function Empresa(){
    var doc = new jsPDF();
    var FilaProducto = [];
    var FilaAcomulador = [];
    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        var Hoja = 0;
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
            var TotalImporte_Alm = 0;
            var TotalImporte_Pro = 0;
            var FavorAlmacen = 0;
            var FavorPro = 0;
            var Dep_Actual = '';
          
            for(var index = 0 ;index < PlantaUno.length;index++ ){
                if((PlantaUno[index].PlantaC == A_Plantas[p].LlaveTabla) && (PlantaUno[index].DepartamentoC == A_Departamento[d])){//Si la planta y derpartamento coinciden en el recorrido del registro actua

                    console.table(PlantaUno[index]); 
                    FilaProducto.push(PlantaUno[index]);

                    if(Dep_Actual != PlantaUno[index].DepartamentoC){//Se identifica el cambio de departamento para incrementar hoja
                        Hoja++;
                        Dep_Actual =  PlantaUno[index].DepartamentoC;
                    }

                    var Nombre_Planta = A_Plantas[NombrePlanta(PlantaUno[index].PlantaC)].Nombre;//Otbengo el nombre de planta
                    var IndiceDepartamento = PlantaUno[index].PlantaC+" " +PlantaUno[index].DepartamentoC;//Variable par abuscar departamento
                    var Nombre_Departamento = A_DepartamentoInfo[NombreDepartamento(IndiceDepartamento)].Nombre;//Otbengo el nombre de departamento

                    TotalImporte_Alm = TotalImporte_Alm + PlantaUno[index].ImporteC;
                    TotalImporte_Pro = TotalImporte_Pro + PlantaUno[index].importeD;

                    if(PlantaUno[index].a_Favor == 'Produccion'){//Incrementa El importe a favor de Produccion o almacen
                        FavorPro = FavorPro + PlantaUno[index].importeDif;
                    }else if(PlantaUno[index].a_Favor == 'Almacen'){
                        FavorAlmacen = FavorAlmacen + PlantaUno[index].importeDif;
                    }
                }//Fin IF Principal
            }//Recorre la tabla maestra
            var Acomulador = {Almacen_Importe : TotalImporte_Alm, Almacen_Produccion:  TotalImporte_Pro,  FavorAlmacen:  FavorAlmacen, FavorPro:  FavorPro,  Hoja:  Hoja,  NombrePlanta: Nombre_Planta, NombreDepartamento:  Nombre_Departamento}
            console.log("Almacen Importe: " + TotalImporte_Alm + " Almacen Produccion: " + TotalImporte_Pro + " FavorAlmacen: "+ FavorAlmacen + " FavorPro: "+ FavorPro + " Hoja: "+ Hoja + " NombrePlanta: " + Nombre_Planta + " NombreDepartamento: " +Nombre_Departamento);
            FilaAcomulador.push(Acomulador);
            //console.table(FilaProducto);
            //TOTAL.push({Almacen_Importe : TotalImporte_Alm, Almacen_Produccion:  TotalImporte_Pro,  FavorAlmacen:  FavorAlmacen, FavorPro:  FavorPro,  Hoja:  Hoja,  NombrePlanta: Nombre_Planta, NombreDepartamento:  Nombre_Departamento});
        }
    }
    PDF(doc,FilaProducto, FilaAcomulador);
}

/********************** DETALLE ***************************/

function NombrePlanta(NomPlanta){
    let busqueda = NomPlanta;
    let indice = A_Plantas.findIndex(mascota => mascota.LlaveTabla === busqueda);
    return indice
}


function NombreDepartamento(NomDepartamento){
    let busqueda = NomDepartamento;
    let indice = A_DepartamentoInfo.findIndex(mascota => mascota.LlaveTabla === busqueda);
    return indice
}




function PDF(doc,FilaProducto, FilaAcomulador) {
    console.log("*********************************************************************************************************************************************");
    console.table(FilaProducto);
    console.table(FilaAcomulador);
    console.log("***************************************************** FINAL *********************************************************************************");
    

   
    var SaltoLinea = 80;
    var ultimoSalto = 80;
    var i = 0; //Idice que recorre acomuladores
    for (let index = 0; index < FilaProducto.length; index++) {
        
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("12315649845613854531568432138541323541513185453138541321835121351856546451351512135813223432143242341851231351", 10, 20);
     
        doc.text("1   P-XXXXXXXX" + "\t\t\t\t\t REPORTE COMPARATIVO DE CONSUMOS" + "\t\t\t\t FECHA "+moment().format("D MMM YYYY"), 10, 30);
        doc.text("2  ", 10, 35);
        doc.text("3   ACME - DIV. NOMINA"+"\t\t\t\t\t PLANTA " +FilaAcomulador[i].NombrePlanta+ "\t\t\t\t\t\t HOJA "+FilaAcomulador[i].Hoja, 10, 40);
    
        doc.text("4   CONTABILIDAD", 10, 45);
        doc.text("5  ", 10, 50);
    
        doc.text("6   DPTO. " + FilaAcomulador[i].NombreDepartamento, 10, 55);
        doc.text("7  ", 10, 60);
        doc.text("8   PRODUCTO" + "\t\t\t REPORTE ALMACEN" + "\t\t REPORTE PRODUCCION" + "\t\t DIFERENCIA ENTRE REPORTES", 10, 65);
        doc.setFontSize(6);
        doc.text("9   CODIGO" + "\t DESCRIPCION" + "\t\t CONSUMO " + "\tIMPORTE" + "\t\t\t CONSUMO " + "\tIMPORTE" + "\t\t\t\t\t CONSUMO " + "\tIMPORTE" + "\tA FAVOR", 10, 70);
        doc.text("10  ------------" + "\t----------------------" + "\t\t-----------------" + "\t---------------" + "\t\t\t---------------" + "\t---------------" +"\t\t\t\t\t-----------------" + "\t-------------"+ "\t----------------", 10, 75);
        doc.setFontSize(7);

        
        var cambio = FilaProducto[index].DepartamentoC;
        //console.table(FilaProducto[index]);
        doc.text("# "+FilaProducto[index].Cod_Producto, 15, (SaltoLinea)); 
        doc.text(FilaProducto[index].Nom_Producto, 30, (SaltoLinea)); 
        doc.text(FilaProducto[index].ConsumoC.toString(), 57, (SaltoLinea)); 
        doc.text( FilaProducto[index].ImporteC.toString(), 72, (SaltoLinea)); 
        doc.text(FilaProducto[index].ConsumoD.toString(), 97, (SaltoLinea)); 
        doc.text( FilaProducto[index].importeD.toString(), 112, (SaltoLinea));
        doc.text( FilaProducto[index].ConsumosDif.toString(), 147, (SaltoLinea)); 
        doc.text(FilaProducto[index].importeDif.toString(), 162, (SaltoLinea)); 
        doc.text( FilaProducto[index].a_Favor.toString(), 175, (SaltoLinea));  
        SaltoLinea+=5;
        
        if(index == (FilaProducto.length -1)){
            console.log(FilaAcomulador[i]);
            doc.text("# "+FilaAcomulador[i].Almacen_Importe +"# "+FilaAcomulador[i].Almacen_Produccion+"# "+FilaAcomulador[i].FavorAlmacen+"# "+FilaAcomulador[i].FavorPro+"# "+FilaAcomulador[i].Hoja+"# "+FilaAcomulador[i].NombrePlanta, 15, (SaltoLinea)); 
            //doc.addPage();
            SaltoLinea = 80;
        }else{
            if(cambio != FilaProducto[(index+1)].DepartamentoC){
                console.log(FilaAcomulador[i]);
                doc.setFontSize(8);
                doc.text("TOTAL DEL DPTO.   "+FilaAcomulador[i].NombreDepartamento, 15, (SaltoLinea));
                doc.text("ALMACEN       IMPORTE "+FilaAcomulador[i].Almacen_Importe.toString() + " \t DIFERENCIA A FAVOR " +FilaAcomulador[i].FavorAlmacen.toString(), 15, (SaltoLinea+5));
                doc.text("PRODUCCION    IMPORTE "+FilaAcomulador[i].Almacen_Produccion.toString() + " \t DIFERENCIA A FAVOR "+FilaAcomulador[i].FavorPro.toString(), 15, (SaltoLinea+10)); 
                //doc.text("ALMACEN       IMPORTE "+ ++"# "++"# "+FilaAcomulador[i].Hoja+"# "+FilaAcomulador[i].NombrePlanta, 15, (SaltoLinea+15));
               
                doc.addPage();
                SaltoLinea = 80;
                cambio = FilaProducto[index].DepartamentoC;
                i++;
            }
        }
    }

    var date = new Date();
    doc.setTextColor(100);
     
    doc.line(20, 280, 80, 280); // horizontal line (Eje X, Punto Y,Eje X,Punto Y)
    doc.text("Empleado", 30, 285);
    doc.text("Almacen Morelos", 30, 290);


    doc.line(120, 280, 195, 280); // horizontal line (Eje X, Punto Y,Eje X,Punto Y)
    doc.text("Autoriza", 160, 285);
 
    // Save the PDF
    doc.save('documento.pdf');
}

 