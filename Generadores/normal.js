const btnSimularNormal = document.getElementById("btnNormalSim");
const btnNormalDelete = document.getElementById("btnNormalDel");
const btnExportToExcelRandVar = document.getElementById(
    "btnExportToExcelRandVar"
);
const btnExportToExcelFrec = document.getElementById("btnExportToExcelFrec");

let gridRandVarOptions = {};
var randNormal;

export const getRandomNumberNormal = () => {
    return [...randNormal];
};

const truncateDecimals = (number, digits) => {
    const multiplier = Math.pow(10, digits);
    return Math.trunc(number * multiplier) / multiplier;
};

var rnd1 = 0;
var rnd2 = 0;
const distribucionNormal = (media, desviacion, i) => {
    //Box muller
    let z = 0;

    if (i === 0 || i % 2 === 0) {
        rnd1 = truncateDecimals(Math.random(), 4);
        while (rnd1 === 0) {
            rnd1 = truncateDecimals(Math.random(), 4);
        }
        rnd2 = truncateDecimals(Math.random(), 4);
    }

    if (i % 2 == 0) {
        z = ((Math.sqrt(-2 * Math.log(rnd1)) * Math.sin(2 * Math.PI * rnd2)) * desviacion) + media;
    } else {
        z = ((Math.sqrt(-2 * Math.log(rnd1)) * Math.cos(2 * Math.PI * rnd2)) * desviacion) + media;
    }

    let var_aleatoria = truncateDecimals(z, 4);

    return var_aleatoria;
};

const generacionVariablesAleatoriasNormales = (media, desviacion, n) => {
    let variablesAleatorias = [];

    let randObj = {};
    for (let i = 0; i < n; i++) {
        randObj = {
            n: i + 1,
            Aleatorio: distribucionNormal(media, desviacion, i),
        };

        variablesAleatorias.push(randObj);
    }
    return variablesAleatorias;
};

const simularNormal = () => {
    let variablesAleatorias = [];

    borrarTablaNormal();

    const eGridDiv = document.querySelector("#gridVariable");
    let media = parseFloat(document.getElementById("normal-media").value);
    let desviacion = parseFloat(
        document.getElementById("normal-desviacion").value
    );
    let n = parseInt(document.getElementById("normal-n").value);

    if (
        typeof media === "undefined" ||
        typeof desviacion === "undefined" ||
        typeof n === "undefined"
    )
        return alert("Por favor, ingrese todos los datos.");
    if (isNaN(media) || isNaN(desviacion) || isNaN(n))
        return alert("Por favor, ingrese números.");

    //media > a desv???

    if (n < 1) return alert("El valor de 'n' debe ser mayor que 0");

    try {
        variablesAleatorias = generacionVariablesAleatoriasNormales(
            media,
            desviacion,
            n
        );
        randNormal = [...variablesAleatorias];
    } catch (error) {
        alert("Oops! Ha ocurrido un error");
        console.log(error);
    }

    let columnDefs = [{ field: "n" }, { field: "Aleatorio" }];

    gridRandVarOptions = {
        columnDefs,
        rowData: variablesAleatorias,
    };

    new agGrid.Grid(eGridDiv, gridRandVarOptions);
    btnExportToExcelRandVar.removeAttribute("hidden");
};

const borrarTablaNormal = () => {
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

const exportToExcelRandVar = () => {
    gridRandVarOptions.api.exportDataAsExcel();
};

btnExportToExcelRandVar.addEventListener("click", exportToExcelRandVar);
btnNormalDelete.addEventListener("click", borrarTablaNormal);
btnSimularNormal.addEventListener("click", simularNormal);
