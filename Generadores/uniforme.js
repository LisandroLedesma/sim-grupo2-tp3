const btnSimular = document.getElementById("btnUniSim");
const btnUniDelete = document.getElementById("btnUniDel");
const btnExportToExcelRandVar = document.getElementById(
    "btnExportToExcelRandVar"
);
const btnExportToExcelFrec = document.getElementById("btnExportToExcelFrec");

let gridRandVarOptions = {};
var rndUnif;

export const getRandomNumberUniforme = () => {
    return [...rndUnif];
};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
};

const distribucionUniforme = (a, b) => {
    return truncateDecimals(Math.random() * (b - a) + a, 4);
};

const generacionVariablesAleatoriasUniformes = (a, b, n) => {
    let variablesAleatorias = [];

    let randObj = {};
    for (let i = 0; i < n; i++) {
        randObj = {
            n: i + 1,
            Aleatorio: distribucionUniforme(a, b),
        };

        variablesAleatorias.push(randObj);
    }
    return variablesAleatorias;
};

const simularUniforme = () => {
    let variablesAleatorias = [];

    borrarTablaUniforme();

    const eGridDiv = document.querySelector("#gridVariable");
    let a = parseFloat(document.getElementById("unif-a").value);
    let b = parseFloat(document.getElementById("unif-b").value);
    let n = parseInt(document.getElementById("unif-n").value);

    if (
        typeof a === "undefined" ||
        typeof b === "undefined" ||
        typeof n === "undefined"
    )
        return alert("Por favor, ingrese todos los datos.");
    if (isNaN(a) || isNaN(b) || isNaN(n))
        return alert("Por favor, ingrese números.");
    // A puede ser igual que B????
    if (a >= b)
        return alert("El valor de 'a' debe ser menor que el valor de 'b'");
    if (n < 1) return alert("El valor de 'n' debe ser mayor que 0");

    try {
        variablesAleatorias = generacionVariablesAleatoriasUniformes(a, b, n);
        rndUnif = [...variablesAleatorias];
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

const borrarTablaUniforme = () => {
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
btnUniDelete.addEventListener("click", borrarTablaUniforme);
btnSimular.addEventListener("click", simularUniforme);
