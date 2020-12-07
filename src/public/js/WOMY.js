function Consumos() {
    var TotalPlantas = 2;
    var A_Departamento = ['DD1111', 'DD2222', 'DD3333'];
    var TotalDepartamentos = A_Departamento.length;


    for (let p = 0; p < TotalPlantas; p++) {//For Plantas
        for (let d = 0; d < TotalDepartamentos; d++) {//For Departamentos
             console.log("Planta: " + A_Plantas[p] + " Departamento: " + A_Departamento[d]);
        }
    }
}





