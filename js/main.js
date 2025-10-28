// main.js

// Load CSV
const csvUpload = document.getElementById("csvUpload");
const startScratch = document.getElementById("startScratch");
const savedDataContainer = document.getElementById("savedDataContainer");

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
  pokemonData = [];
  localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
  window.location.href = "main.html";
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

