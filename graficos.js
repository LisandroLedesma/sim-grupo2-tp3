import { getRandomNumberUniforme } from "./Generadores/uniforme.js";
import { getRandomNumberNormal } from "./Generadores/normal.js";
import { getRandomNumberExp } from "./Generadores/exponencial.js";

const btnExportToExcelFrec = document.getElementById("btnExportToExcelFrec");
const btnUniGraf = document.getElementById("btnUniGraf");
const btnExpGraf = document.getElementById("btnExpGraf");
const btnNormalGraf = document.getElementById("btnNormalGraf");

let gridOptions = {};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
};

const getNumbers = (type) => {
    let arrNumb = [];
    if (type === "uniforme") arrNumb = getRandomNumberUniforme();
    else if (type === "exponencial") arrNumb = getRandomNumberExp();
    else if (type === "normal") arrNumb = getRandomNumberNormal();
    let aux = [];
    arrNumb.forEach((rnd) => {
        aux.push(rnd.Aleatorio);
    });
    return aux;
};

const generarTabla = (filas) => {
    const eGridDiv = document.querySelector("#gridFrecuencia");

    let columnDefs = [
        { field: "LimInf" },
        { field: "LimSup" },
        { field: "MC" },
        { field: "Fe" },
        { field: "Fo" },
        // { field: "Estadístico" },
    ];

    let rowData = [];
    filas.forEach((fila) => {
        let row = {
            LimInf: fila.lim_inf,
            LimSup: fila.lim_sup,
            MC: fila.marca_clase,
            Fe: fila.fe,
            Fo: fila.fo,
            // "Estadístico": fila.estadistico,
        };
        rowData.push(row);
    });

    gridOptions = {
        columnDefs,
        rowData,
    };

    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();

    btnExportToExcelFrec.removeAttribute("hidden");
};

//****************************************************************************************
const test = (type) => {
    let select = "";
    // const spanL = document.getElementById('resL');
    // const spanLD = document.getElementById('dataL');

    const numeros = getNumbers(type);

    if (type === "uniforme") select = document.getElementById("intUnif");
    else if (type === "exponencial") select = document.getElementById("intExp");
    else select = document.getElementById("intNormal");

    const intervalos = parseInt(select.value);
    numeros.sort();
    let orden = numeros.sort(function (a, b) {
        return a - b;
    });

    let media = parseFloat(document.getElementById("normal-media").value);
    let desviacion = parseFloat(document.getElementById("normal-desviacion").value);
    let lambda = parseFloat(document.getElementById("exp-lambda").value);


    const max = orden[orden.length - 1];
    const min = orden[0];
    const paso = Number((max - min) / intervalos + 0.0001);


    let filas = sumatoria(orden, min, max, intervalos, paso, type, media, desviacion, lambda);



    generarTabla(filas);
    generarHistograma(filas, paso, type);
};

const sumatoria = (nros, minimo, maximo, int, paso, type, media, desviacion, lambda) => {
    let filas = [];
    // let suma = 0;
    let min = minimo;
    let lim_inf = 0;
    let lim_sup = 0;

    for (let i = 0; i < int; i++) {
        if (i == 0) {
            lim_inf = Number(min);
            lim_sup = truncateDecimals(Number(min) + Number(paso), 4);
        } else {
            lim_inf = Number(lim_sup);
            lim_sup = truncateDecimals(Number(lim_sup) + Number(paso), 4);
        }

        let fila = new Object();

        let mc = truncateDecimals(lim_inf + (lim_sup - lim_inf) / 2, 4);
        fila.marca_clase = Number(mc);
        fila.lim_inf = Number(lim_inf);
        fila.lim_sup = Number(lim_sup);
        fila.fo = frecObs(nros, lim_inf, lim_sup);

        if (type === "uniforme") {
            fila.fe = nros.length / int;
        }
        if (type === "normal") {
            let prob = ((Math.exp(-0.5 * ((fila.marca_clase - media) / desviacion ) ** 2)) / (desviacion * Math.sqrt(2 * Math.PI))) * (fila.lim_sup - fila.lim_inf);
            fila.fe = truncateDecimals(prob * nros.length, 4);
        }
        if (type === "exponencial") {
            let dens = lambda * (Math.exp(-lambda*fila.marca_clase));
            let ancho = fila.lim_sup - fila.lim_inf;
            fila.fe = truncateDecimals((dens*ancho)*nros.length, 4);
        }


        filas.push(fila);
    }

    // return [suma, filas];
    return filas;
};

const frecObs = (nros, inf, sup) => {
    let fo = 0;
    let ord = nros;

    ord.forEach((numero) => {
        if (numero >= inf && numero < sup) {
            fo += 1;
        }
    });

    return fo;
};

// const prueba = (int, suma) => {
//     let v = int - 1;
//     let res = false;
//     let valor_tabla = 0;

//     chi.forEach((par) => {
//         if (par[0] === v) {
//             valor_tabla = par[1];
//         }
//     });

//     if (suma <= valor_tabla) {
//         res = true;
//     }

//     return [res, suma, valor_tabla];
// }

const exportToExcelFrec = () => {
    gridOptions.api.exportDataAsExcel();
};

btnExportToExcelFrec.addEventListener("click", exportToExcelFrec);
btnUniGraf.addEventListener("click", () => {
    test("uniforme");
});
btnExpGraf.addEventListener("click", () => {
    test("exponencial");
});
btnNormalGraf.addEventListener("click", () => {
    test("normal");
});

//****************************************************************************************
// Graficos

const generarHistograma = (filas, paso, type) => {
    let randArr = getNumbers(type);

    let startValue = filas[0].lim_inf;
    let endValue = filas[filas.length - 1].lim_sup;

    var x1 = [];


    //Carga frecuencias observadas
    for (var i = 0; i < randArr.length; i++) {
        x1[i] = Number(randArr[i]);
    }

    //Frecuencias observadas
    let trace1 = {
        x: x1,
        type: "histogram",
        name: "Frecuencia Observada",
        marker: {
            color: "rgb(255, 100, 102)",
        },
        opacity: 0.75,
        xbins: {
            end: endValue,
            start: startValue,
            size: paso,
        },
    };

    let layout = {
        title: "Histograma de frecuencias para distribución " + type,
        barmode: "overlay",
        xaxis: { title: "Intervalos" },
        yaxis: { title: "Frecuencia" },
    };

    let data = [trace1];

    let config = {
        responsive: true,
    };
    Plotly.newPlot("gridGrafico", data, layout, config);
};
