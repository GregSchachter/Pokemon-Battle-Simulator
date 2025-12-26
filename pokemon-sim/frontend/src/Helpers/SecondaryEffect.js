export default function SecondaryEffect(move) {
  const effects = [];

  // Flinch Chance
  if (move.meta.flinch_chance) {
    const flinchCheck = Math.random() * 100 < move.meta.flinch_chance;

    if (flinchCheck) {
      effects.push("flinch");
    }
  }

  // Stat Changes
  if (move.meta.stat_chance) {
    const statCheck = Math.random() * 100 < move.meta.stat_chance;

    if (statCheck) {
      const stats = [];
      if (move.meta.category.name === "damage+lower") {
        for (let i = 0; i < move.stat_changes.length; i++) {
          stats.push({
            stat: move.stat_changes[i].stat.name,
            changeAmount: move.stat_changes[i].change,
          });
        }

        effects.push({ target: "opponent", stats: stats });
      } else if (move.meta.category.name === "damage+raise") {
        for (let i = 0; i < move.stat_changes.length; i++) {
          stats.push({
            stat: move.stat_changes[i].stat.name,
            changeAmount: move.stat_changes[i].change,
          });
        }

        effects.push({ target: "user", stats: stats });
      }
    }
  }

  // Drain Moves
  if (move.meta.drain > 0) {
    effects.unshift({ type: "drain", percent: move.meta.drain });
  }

  // Recoil
  if (move.meta.drain < 0) {
    effects.unshift({ type: "recoil", percent: move.meta.drain });
  }

  // Common Ailments
  if (move.meta.ailment_chance > 0) {
    const accCheck = Math.random() * 100 < move.effect_chance;

    if (accCheck) {
      if (move.meta.ailment.name !== "none")
        effects.push(move.meta.ailment.name);
    }
  }

  if (effects.length > 0) return effects;
}
