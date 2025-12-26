export default async function ConfusuionDmg(attacker) {
  let burn = 1;
  if (attacker.status.includes("burn")) burn = 0.5;

  let atkStat;
  let defStat;

  let random = (Math.random() * 15 + 85) / 100;

  // Get attacking and defending stat values with stat changes

  if (attacker.statChanges.attack >= 0) {
    atkStat = (attacker.atk * (attacker.statChanges.attack + 2)) / 2;
  } else {
    atkStat = (attacker.atk * 2) / (Math.abs(attacker.statChanges.attack) + 2);
  }
  if (attacker.statChanges.defense >= 0) {
    defStat = (attacker.def * (attacker.statChanges.defense + 2)) / 2;
  } else {
    defStat = (attacker.def * 2) / (Math.abs(attacker.statChanges.defense) + 2);
  }

  const damage = Math.floor(
    ((((2 * attacker.level) / 5 + 2) * 40 * (atkStat / defStat)) / 50 + 2) *
      random *
      burn
  );

  return damage;
}
