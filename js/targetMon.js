// Elements
const targetGen = document.getElementById("targetGen");
const targetName = document.getElementById("targetName");
const targetAbility = document.getElementById("targetAbility");
const targetNature = document.getElementById("targetNature");
const targetShiny = document.getElementById("targetShiny");
const unlockCheckbox = document.getElementById("unlockTargetMon");

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

// Static Arrays
const generations = [1,2,3,4,5,6,7,8,9];
const shinyOptions = ["No","Yes"];

//Populate static dropdowns
populateSelect(targetGen, generations);
populateSelect(targetShiny, shinyOptions);

// Helper Functions
function populateSelect(select, options) {
    select.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join("");
}

function capitalize(word) {
    if (word === undefined) return;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatNature(name, increased, decreased) {
    if (increased === decreased || (!increased && !decreased)) return capitalize(name);   
    const inc = statAbbreviation(increased);
    const dec = statAbbreviation(decreased);
    return `${capitalize(name)} (+${inc},-${dec})`;
}

function statAbbreviation(stat) {
    const map = {
        attack: "Atk",
        defense: "Def",
        "special-attack": "Sp. Atk",
        "special-defense": "Sp. Def",
        speed: "Speed"
    };
    return map[stat] || capitalize(stat);
}

// API Loading
async function loadNatures() {
    const res = await fetch("https://pokeapi.co/api/v2/nature?limit=50");
    const data = await res.json();
    
    const detailed = await Promise.all(
        data.results.map(async n => {
            const nData = await fetch(n.url).then(r => r.json());
            return formatNature(
                n.name,
                nData.increased_stat?.name,
                nData.decreased_stat?.name
            );
        })
    );
    populateSelect(targetNature, detailed);
}

async function loadMonsForGen(genNum) {
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${genNum}`);
    const data = await res.json();

    const speciesNames = data.pokemon_species
        .map(p => capitalize(p.name)).sort();
    populateSelect(targetName, speciesNames);
}

async function loadAbilitiesForMon(speciesName) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
    const data = await res.json();

    const abilities = data.abilities.map(a => capitalize(a.ability.name));
    populateSelect(targetAbility, abilities);
}
function setEditability(condition, idArray) {
    const isEditable = condition;

    idArray.forEach(id => {
        const e = document.getElementById(id);
        if (!e) return;
        e.disabled = !isEditable;
    });
}

// Event Listeners
unlockCheckbox.addEventListener("change", () => {
    setEditability(unlockCheckbox.checked, targetMonFields);
});

targetGen.addEventListener("change", async () => {
    await loadMonsForGen(targetGen.value);
    targetAbility.innerHTML = "";
});

targetName.addEventListener("change", async () => {
    await loadAbilitiesForMon(targetName.value);
});

// Initialize Page
async function init() {
    unlockCheckbox.checked = false;
    targetGen.value = 4;
    targetShiny.value = "Yes";

    await loadMonsForGen(targetGen.value);
    await loadNatures();
    await loadAbilitiesForMon(targetName.value);

    setEditability(unlockCheckbox.checked, targetMonFields);
}
init();

        

