export default function SecondaryEffectText(attacker, defender, move) {
  if (
    move[2].moveText === "It had no effect" ||
    move[2].moveText === "It missed" ||
    move.length === 3
  )
    return;

  const text = [];

  const mutuallyExclusive = ["sleep", "burn", "poison", "paralysis", "freeze"];

  const defenderHasExclusive = defender.status.some((status) =>
    mutuallyExclusive.includes(status)
  );

  if (!defenderHasExclusive) {
    if (move[3].includes("burn")) {
      text.push(`${defender.pokemon} was burned`);
    } else if (move[3].includes("sleep")) {
      text.push(`${defender.pokemon} fell asleep`);
    } else if (move[3].includes("freeze")) {
      text.push(`${defender.pokemon} was frozen solid`);
    } else if (move[3].includes("poison")) {
      text.push(`${defender.pokemon} was poisoned`);
    } else if (move[3].includes("paralysis")) {
      text.push(`${defender.pokemon} was paralyzed`);
    }
  }

  if (move[3].includes("confusion") && !defender.status.includes("confusion")) {
    text.push(`${defender.pokemon} is confused`);
  }

  if (move[3].includes("trap") && !defender.status.includes("trap")) {
    text.push(`${defender.pokemon} was trapped`);
  }

  move[3].map((effect) => {
    if (effect.target === "user") {
      effect.stats.map((stat) => {
        let currStat = stat.stat;
        if (stat.changeAmount > 0) {
          if (attacker.statChanges[currStat] === 6) {
            text.push(`${attacker.pokemon}'s ${currStat} won't go any higher`);
          } else if (stat.changeAmount === 1) {
            text.push(`${attacker.pokemon}'s ${currStat} rose`);
          } else if (stat.changeAmount === 2) {
            text.push(`${attacker.pokemon}'s ${currStat} rose sharply`);
          } else if (stat.changeAmount >= 3) {
            text.push(`${attacker.pokemon}'s ${currStat} rose drastically`);
          }
        } else {
          if (attacker.statChanges[currStat] === -6) {
            text.push(`${attacker.pokemon}'s ${currStat} won't go any lower`);
          } else if (stat.changeAmount === -1) {
            text.push(`${attacker.pokemon}'s ${currStat} fell`);
          } else if (stat.changeAmount === -2) {
            text.push(`${attacker.pokemon}'s ${currStat} harshly fell`);
          } else if (stat.changeAmount <= -3) {
            text.push(`${attacker.pokemon}'s ${currStat} severely fell`);
          }
        }
      });
    }
    if (effect.target === "opponent") {
      effect.stats.map((stat) => {
        let currStat = stat.stat;
        if (stat.changeAmount > 0) {
          if (defender.statChanges.currStat === 6) {
            text.push(`${defender.pokemon}'s ${currStat} won't go any higher`);
          }

          if (stat.changeAmount === 1) {
            text.push(`${defender.pokemon}'s ${currStat} rose`);
          } else if (stat.changeAmount === 2) {
            text.push(`${defender.pokemon}'s ${currStat} rose sharply`);
          } else if (stat.changeAmount >= 3) {
            text.push(`${defender.pokemon}'s ${currStat} rose drastically`);
          }
        } else {
          if (defender.statChanges.currStat === -6) {
            text.push(`${defender.pokemon}'s ${currStat} won't go any lower`);
          }

          if (stat.changeAmount === -1) {
            text.push(`${defender.pokemon}'s ${currStat} fell`);
          } else if (stat.changeAmount === -2) {
            text.push(`${defender.pokemon}'s ${currStat} harshly fell`);
          } else if (stat.changeAmount <= -3) {
            text.push(`${defender.pokemon}'s ${currStat} severely fell`);
          }
        }
      });
    }
  });
  return text;
}
