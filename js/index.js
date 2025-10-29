
import { loadNatures, loadMonsForGen, loadAbilitiesForMon } from "./pokeApiUtils.js";
import { populateSelect, } from "./uiUtils.js";
import { TargetPokemon } from "./pokemon.js";

const csvUpload = document.getElementById("csvUpload");
const startScratch = document.getElementById("startScratch");
const savedDataContainer = document.getElementById("savedDataContainer");

const modal = document.getElementById("targetModal");
const cancelModal = document.getElementById("cancelModal");
const confirmModal = document.getElementById("confirmModal");
const modalGen = document.getElementById("modalGen");
const modalName = document.getElementById("modalName");
const modalNature = document.getElementById("modalNature");
const modalAbility = document.getElementById("modalAbility");
const modalShiny = document.getElementById("modalShiny");


// Static Arrays
const generations = [1,2,3,4,5,6,7,8,9];
const shinyOptions = ["No","Yes"];

//Populate static dropdowns
populateSelect(modalGen, generations);
populateSelect(modalShiny, shinyOptions);

// Initialize data
let pokemonData = [];

//Check for saved data
const savedData = localStorage.getItem("pokemonData");
if (savedData) {
    const loadSavedBtn = document.createElement("button");
    loadSavedBtn.textContent = "Load Saved Data";
    loadSavedBtn.addEventListener("click", () => {
        pokemonData = JSON.parse(savedData);
        window.location.href = "main.html";
    });
    savedDataContainer.appendChild(loadSavedBtn);
}

// Start from scratch
startScratch.addEventListener("click", () => {
    modal.classList.remove("hidden");

    pokemonData = [];
    localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
});

cancelModal.addEventListener("click", () => {
    setModalDefaults();
    modal.classList.add("hidden");
});

confirmModal.addEventListener("click", () => {
    const data = {
        gen: document.getElementById("modalGen").value,
        name: document.getElementById("modalName").value,
        nature: document.getElementById("modalNature").value,
        ability: document.getElementById("modalAbility").value,
        shiny: document.getElementById("modalShiny").value,
        ivs: {
            hp: parseInt(document.getElementById("iv-hp").value) || 0,
            atk: parseInt(document.getElementById("iv-atk").value) || 0,
            def: parseInt(document.getElementById("iv-def").value) || 0,
            spa: parseInt(document.getElementById("iv-spa").value) || 0,
            spd: parseInt(document.getElementById("iv-spd").value) || 0,
            spe: parseInt(document.getElementById("iv-spe").value) || 0,
        }
    };

    const target = new TargetPokemon(data);
    localStorage.setItem("targetPokemon", JSON.stringify(target.toJSON()));

    window.location.href = "main.html";
});

document.addEventListener("DOMContentLoaded", async () => {
    setModalDefaults();
});

modalGen.addEventListener("change", async () => {
    await loadMonsForGen(modalGen.value, modalName);
    await loadAbilitiesForMon(modalName.value.toLowerCase(), modalAbility);
});

modalName.addEventListener("change", async () => {
    await loadAbilitiesForMon(modalName.value.toLowerCase(), modalAbility);
});

// Handle CSV upload
csvUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            pokemonData = results.data;
            localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
            window.location.href = "main.html";
        }
    });
});

async function setModalDefaults() {
    modalGen.value = 4;
    modalShiny.value = "No";

    await loadNatures(modalNature);
    await loadMonsForGen(modalGen.value, modalName);
    await loadAbilitiesForMon(modalName.value, modalAbility);
}



