
const tableContainer = document.getElementById("tableContainer");

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

// Initial render
renderTable(pokemonData);

