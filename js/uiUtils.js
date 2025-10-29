
export function populateSelect(select, options) {
    select.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join("");
}

export function capitalize(word) {
    if (word === undefined) return;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatNature(name, increased, decreased) {
    if (increased === decreased || (!increased && !decreased)) return capitalize(name);   
    const inc = statAbbreviation(increased);
    const dec = statAbbreviation(decreased);
    return `${capitalize(name)} (+${inc},-${dec})`;
}

export function statAbbreviation(stat) {
    const map = {
        attack: "Atk",
        defense: "Def",
        "special-attack": "Sp. Atk",
        "special-defense": "Sp. Def",
        speed: "Speed"
    };
    return map[stat] || capitalize(stat);
}

export function setEditability(condition, idArray) {
    const isEditable = condition;

    idArray.forEach(id => {
        const e = document.getElementById(id);
        if (!e) return;
        e.disabled = !isEditable;
    });
}
