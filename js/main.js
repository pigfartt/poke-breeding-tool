
import { loadNatures, loadMonsForGen, loadAbilitiesForMon } from "./pokeApiUtils.js";
import { populateSelect, setEditability } from "./uiUtils.js";

// Elements
const targetGen = document.getElementById("targetGen");
const targetName = document.getElementById("targetName");
const targetAbility = document.getElementById("targetAbility");
const targetNature = document.getElementById("targetNature");
const targetShiny = document.getElementById("targetShiny");
const unlockCheckbox = document.getElementById("unlockTargetMon");
const tableContainer = document.getElementById("tableContainer");

// Static Arrays
const generations = [1,2,3,4,5,6,7,8,9];
const shinyOptions = ["No","Yes"];

const targetMonFields = [
    "targetName",
    "targetGen",
    "targetAbility",
    "targetNature",
    "targetShiny",
    "ivHP",
    "ivAtk",
    "ivDef",
    "ivSpAtk",
    "ivSpDef",
    "ivSpe"
];

//Populate static dropdowns
populateSelect(targetGen, generations);
populateSelect(targetShiny, shinyOptions);

// Event Listeners
unlockCheckbox.addEventListener("change", () => {
    setEditability(unlockCheckbox.checked, targetMonFields);
});


document.addEventListener("DOMContentLoaded", init());

// Load dataset from localStorage
let pokemonData = JSON.parse(localStorage.getItem("pokemonData") || "[]");

// Render table
function renderTable(data) {
    if (!data || data.length === 0) {
        tableContainer.innerHTML = "<p>No data available.</p>";
        return;
    }

    const headers = Object.keys(data[0]);
    let html = "<table border='1'><thead><tr>";

    headers.forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    data.forEach(row => {
        html += "<tr>";
        headers.forEach(h => html += `<td>${row[h] || ""}</td>`);
        html += "</tr>";
    });

    html += "</tbody></table>";
    tableContainer.innerHTML = html;
}

// Initialize Page
async function init() {
    const targetData = JSON.parse(localStorage.getItem("targetPokemon"));

    await setTargetFromLocal(targetData);

    targetGen.addEventListener("change", async () => {
        await loadMonsForGen(targetGen.value, targetName);
        await loadAbilitiesForMon(targetName.value, targetAbility);

        targetData.name = targetName.value;
        targetData.ability = targetAbility.value;
        targetData.gen = targetGen.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetData));
    });

    targetName.addEventListener("change", async () => {
        await loadAbilitiesForMon(targetName.value, targetAbility);
        targetData.ability = targetAbility.value;

        targetData.name = targetName.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetData));
    });
    
    targetAbility.addEventListener("change", () => {
        targetData.ability = targetAbility.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetData));
    });

    targetShiny.addEventListener("change", () => {
        targetData.shiny = targetShiny.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetData));
    });

    targetNature.addEventListener("change", () => {
        targetData.nature = targetNature.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetData));
    });

    setEditability(unlockCheckbox.checked, targetMonFields);
    renderTable(pokemonData);
}

async function setTargetFromLocal(localTarget) {
    targetGen.value = localTarget.gen;
    targetShiny.value = localTarget.shiny;

    await loadMonsForGen(targetGen.value, targetName);
    await loadNatures(targetNature);
    await loadAbilitiesForMon(targetName.value, targetAbility);
    
    targetName.value = localTarget.name;
    targetAbility.value = localTarget.ability;
    targetNature.value = localTarget.nature;
}

async function setTargetDefaults() {
    unlockCheckbox.checked = false;
    targetGen.value = 4;
    targetShiny.value = "Yes";

    await loadMonsForGen(targetGen.value, targetName);
    await loadNatures(targetNature);
    await loadAbilitiesForMon(targetName.value, targetAbility);
}
