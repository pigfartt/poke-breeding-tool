// =============================
//  Base Class
// =============================
export class Pokemon {
  constructor({
    name = "",
    gen = 1,
    nature = "",
    ability = "",
    shiny = false
  } = {}) {
    this.name = name;
    this.gen = gen;
    this.nature = nature;
    this.ability = ability;
    this.shiny = shiny;
  }

  toJSON() {
    return {
      name: this.name,
      gen: this.gen,
      nature: this.nature,
      ability: this.ability,
      shiny: this.shiny
    };
  }
}

const defaultIVs = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0
};

export class TargetPokemon extends Pokemon {
  constructor({
    ivs = { ...defaultIVs },
    ...baseData
  } = {}) {
    super(baseData);
    this.ivs = { ...ivs };
  }

  setIV(stat, value) {
    if (this.ivs.hasOwnProperty(stat)) {
      this.ivs[stat] = value;
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "target",
      ivs: this.ivs
    };
  }
}

export class ParentPokemon extends Pokemon {
  constructor({
    observedStats = [],
    ...baseData
  } = {}) {
    super(baseData);
    this.observedStats = observedStats; 
    // e.g. [{ level: 5, stats: { hp: 25, atk: 12, def: 9, ... } }]
  }

  addObservation(level, stats) {
    // stats = { hp, atk, def, spa, spd, spe }
    this.observedStats.push({ level, stats });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "parent",
      observedStats: this.observedStats
    };
  }
}
