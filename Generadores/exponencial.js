const btnExpSimular = document.getElementById("btnExpSim");
const btnExpDelete = document.getElementById("btnExpDel");
const btnExportToExcelRandVar = document.getElementById(
    "btnExportToExcelRandVar"
);
const btnExportToExcelFrec = document.getElementById("btnExportToExcelFrec");

let gridRandVarOptions = {};
var rndExp;

export const getRandomNumberExp = () => {
    return [...rndExp];
};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
};

const distribucionExp = (lambda) => {
    return truncateDecimals(Math.log(1 - Math.random()) * (-1 / lambda), 4);
};

const generacionVariablesAleatoriasExp = (lambda, n) => {
    let variablesAleatorias = [];

    let media = 1 / lambda;

    let randObj = {};
    for (let i = 0; i < n; i++) {
        randObj = {
            n: i + 1,
            Aleatorio: distribucionExp(lambda),
        };

        variablesAleatorias.push(randObj);
    }
    return variablesAleatorias;
};

const simularExp = () => {
    let variablesAleatorias = [];

    borrarTablaExp();

    const eGridDiv = document.querySelector("#gridVariable");
    let lambda = parseFloat(document.getElementById("exp-lambda").value);
    let n = parseInt(document.getElementById("exp-n").value);

    if (typeof lambda === "undefined" || typeof n === "undefined")
        return alert("Por favor, ingrese todos los datos.");
    if (isNaN(lambda) || isNaN(n)) return alert("Por favor, ingrese números.");
    if (lambda <= 0) return alert("El valor de 'lambda' debe ser mayor a 0");

    try {
        variablesAleatorias = generacionVariablesAleatoriasExp(lambda, n);
        rndExp = [...variablesAleatorias];
    } catch (error) {
        alert("Oops! Ha ocurrido un error");
    }

    let columnDefs = [{ field: "n" }, { field: "Aleatorio" }];

    gridRandVarOptions = {
        columnDefs,
        rowData: [...variablesAleatorias],
    };

    new agGrid.Grid(eGridDiv, gridRandVarOptions);
    btnExportToExcelRandVar.removeAttribute("hidden");
};

const borrarTablaExp = () => {
    btnExportToExcelRandVar.setAttribute("hidden", "hidden");
    btnExportToExcelFrec.setAttribute("hidden", "hidden");
    const eGridDiv = document.querySelector("#gridVariable");
    const fGridDiv = document.querySelector("#gridFrecuencia");
    const gGridDiv = document.querySelector("#gridGrafico");

    let child = eGridDiv.lastElementChild;
    while (child) {
        eGridDiv.removeChild(child);
        child = eGridDiv.lastElementChild;
    }

    let fchild = fGridDiv.lastElementChild;
    while (fchild) {
        fGridDiv.removeChild(fchild);
        fchild = fGridDiv.lastElementChild;
    }

    let gchild = gGridDiv.lastElementChild;
    while (gchild) {
        gGridDiv.removeChild(gchild);
        gchild = gGridDiv.lastElementChild;
    }
};

// Se podría parametrizar esto para ver qué exportar???
// Tarda mucho en exportar cuando hay muchos datos (con 100k es bastante aceptable el tiempo)
const exportToExcelRandVar = () => {
    gridRandVarOptions.api.exportDataAsExcel();
};

btnExportToExcelRandVar.addEventListener("click", exportToExcelRandVar);
btnExpDelete.addEventListener("click", borrarTablaExp);
btnExpSimular.addEventListener("click", simularExp);
