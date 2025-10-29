
import { loadNatures, loadMonsForGen, loadAbilitiesForMon } from "./pokeApiUtils.js";
import { populateSelect, setEditability } from "./uiUtils.js";
import { TargetPokemon, ParentPokemon } from "./pokemon.js";

// Elements
const targetGen = document.getElementById("targetGen");
const targetName = document.getElementById("targetName");
const targetAbility = document.getElementById("targetAbility");
const targetNature = document.getElementById("targetNature");
const targetShiny = document.getElementById("targetShiny");
const unlockCheckbox = document.getElementById("unlockTargetMon");
const tableContainer = document.getElementById("tableContainer");

const ivHp = document.getElementById("iv-hp");
const ivAtk = document.getElementById("iv-atk");
const ivDef = document.getElementById("iv-def");
const ivSpa = document.getElementById("iv-spa");
const ivSpd = document.getElementById("iv-spd");
const ivSpe = document.getElementById("iv-spe");

// Static Arrays
const generations = [1,2,3,4,5,6,7,8,9];
const shinyOptions = ["No","Yes"];

const targetMonFields = [
    "targetName",
    "targetGen",
    "targetAbility",
    "targetNature",
    "targetShiny",
    "iv-hp",
    "iv-atk",
    "iv-def",
    "iv-spa",
    "iv-spd",
    "iv-spe"
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
    const storedTarget = localStorage.getItem("targetPokemon");
    let targetMon = null;

    if (storedTarget) {
        const parsed = JSON.parse(storedTarget);
        targetMon = new TargetPokemon(parsed);
    } else {
        console.warn("No targetPokemon found in localStorage!");
        return;
    }
    await setTargetFromLocal(targetMon);

    targetGen.addEventListener("change", async () => {
        await loadMonsForGen(targetGen.value, targetName);
        await loadAbilitiesForMon(targetName.value, targetAbility);

        targetMon.name = targetName.value;
        targetMon.ability = targetAbility.value;
        targetMon.gen = targetGen.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
    });

    targetName.addEventListener("change", async () => {
        await loadAbilitiesForMon(targetName.value, targetAbility);
        targetMon.ability = targetAbility.value;

        targetMon.name = targetName.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
    });
    
    targetAbility.addEventListener("change", () => {
        targetMon.ability = targetAbility.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
    });

    targetShiny.addEventListener("change", () => {
        targetMon.shiny = targetShiny.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
    });

    targetNature.addEventListener("change", () => {
        targetMon.nature = targetNature.value;
        localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
    });

    targetMonFields.filter(f => f.startsWith("i")).forEach(stat => {
        const input = document.getElementById(`${stat}`);
        if (!input) return;

        const st = stat.replace("iv-", "");

        input.addEventListener("input", (e) => {
            const value = parseInt(e.target.value) || 0;
            targetMon.ivs[st] = value;
            localStorage.setItem("targetPokemon", JSON.stringify(targetMon));
        });
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

    ivHp.value = localTarget.ivs.hp;
    ivAtk.value = localTarget.ivs.atk;
    ivDef.value = localTarget.ivs.def;
    ivSpa.value = localTarget.ivs.spa;
    ivSpd.value = localTarget.ivs.spd;
    ivSpe.value = localTarget.ivs.spe;
}

async function setTargetDefaults() {
    unlockCheckbox.checked = false;
    targetGen.value = 4;
    targetShiny.value = "Yes";

    ivHp.value = 0;
    ivAtk.value = 0;
    ivDef.value = 0;
    ivSpa.value = 0;
    ivSpd.value = 0;
    ivSpe.value = 0;

    await loadMonsForGen(targetGen.value, targetName);
    await loadNatures(targetNature);
    await loadAbilitiesForMon(targetName.value, targetAbility);
}
