export { loadNatures, loadMonsForGen, loadAbilitiesForMon };
import { populateSelect, capitalize, formatNature } from "./uiUtils.js"

// API Loading
async function loadNatures(element) {
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
    populateSelect(element, detailed);
}

async function loadMonsForGen(genNum, element) {
    if (genNum === "" || genNum === undefined) return;
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${genNum}`);
    const data = await res.json();

    const speciesNames = data.pokemon_species
        .map(p => capitalize(p.name)).sort();
    populateSelect(element, speciesNames);
} 

async function loadAbilitiesForMon(speciesName, element) {
    if (speciesName === "" || speciesName === undefined) return;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
    const data = await res.json();

    const abilities = data.abilities.map(a => capitalize(a.ability.name));
    populateSelect(element, abilities);
}
