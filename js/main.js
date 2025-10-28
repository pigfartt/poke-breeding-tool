// main.js

// Load CSV
const csvUpload = document.getElementById("csvUpload");
const startScratch = document.getElementById("startScratch");
const status = document.getElementById("status");

// Initialize data
let pokemonData = [];

// Start from scratch
startScratch.addEventListener("click", () => {
  pokemonData = [];
  localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
  status.textContent = "Started new dataset!";
  console.log("Data cleared:", pokemonData);
});

// Handle CSV upload
csvUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true, // assumes first row has headers
    skipEmptyLines: true,
    complete: function(results) {
      pokemonData = results.data;
      localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
      status.textContent = `CSV loaded with ${pokemonData.length} rows.`;
      console.log("Parsed CSV data:", pokemonData);
    }
  });
});

// On page load, restore any existing data
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("pokemonData");
  if (stored) {
    pokemonData = JSON.parse(stored);
    status.textContent = `Restored ${pokemonData.length} rows from previous session.`;
    console.log("Restored data:", pokemonData);
  }
});
