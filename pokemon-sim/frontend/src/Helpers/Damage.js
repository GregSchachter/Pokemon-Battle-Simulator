import TypeEffectiveness from "./TypeEffectiveness";

export default async function Damage(attacker, defender, move) {
  const result = {};
  if (move.accuracy < 100) {
    const accCheck = Math.random() * 100 < move.accuracy;

    if (!accCheck) {
      result.damage = 0;
      result.moveText = "It missed";
      return result;
    }
  }

  // OHKO
  if (move.category === "ohko") {
    result.damage = 1000000;
    result.moveText = "It's a one-hit-KO!";
    return result;
  }

  let burn = 1;
  if (move.dmgClass === "physical" && attacker.status.includes("burn"))
    burn = 0.5;

  let type = await TypeEffectiveness(defender, move.type);

  let atkStat;
  let defStat;
  let stab;

  let critChance = Math.floor(Math.random() * 24);
  let crit;
  critChance === 0 ? (crit = 1.5) : (crit = 1);
  if (type.multi === 0) crit = 0;

  // Crits ignore stat changes
  if (crit === 1.5) {
    if (attacker.statChanges.attack < 0) attacker.statChanges.attack = 0;
    if (attacker.statChanges["special-attack"] < 0)
      attacker.statChanges["special-attack"] = 0;
    if (defender.statChanges.defense > 0) defender.statChanges.defense = 0;
    if (defender.statChanges["special-defense"] > 0)
      defender.statChanges["special-defense"] = 0;
  }

  let random = (Math.random() * 15 + 85) / 100;
  attacker.types.includes(move.type) ? (stab = 1.5) : (stab = 1);

  // Get attacking and defending stat values with stat changes
  if (move.dmgClass === "physical") {
    if (attacker.statChanges.attack >= 0) {
      atkStat = (attacker.atk * (attacker.statChanges.attack + 2)) / 2;
    } else {
      atkStat =
        (attacker.atk * 2) / (Math.abs(attacker.statChanges.attack) + 2);
    }
    if (defender.statChanges.defense >= 0) {
      defStat = (defender.def * (defender.statChanges.defense + 2)) / 2;
    } else {
      defStat =
        (defender.def * 2) / (Math.abs(defender.statChanges.defense) + 2);
    }
  } else if (move.dmgClass === "special") {
    if (attacker.statChanges["special-attack"] > 0) {
      atkStat =
        (attacker.spatk * (attacker.statChanges["special-attack"] + 2)) / 2;
    } else {
      atkStat =
        (attacker.spatk * 2) /
        (Math.abs(attacker.statChanges["special-attack"]) + 2);
    }
    if (defender.statChanges["special-defense"] > 0) {
      defStat =
        (defender.spdef * (defender.statChanges["special-defense"] + 2)) / 2;
    } else {
      defStat =
        (defender.spdef * 2) /
        (Math.abs(defender.statChanges["special-defense"]) + 2);
    }
  }

  const damage = Math.floor(
    ((((2 * attacker.level) / 5 + 2) * move.power * (atkStat / defStat)) / 50 +
      2) *
      random *
      stab *
      type.multi *
      crit *
      burn
  );

  result.damage = damage;
  result.moveText = type.text;

  if (crit === 1.5) result.crit = "It's a critical hit";

  return result;
}
