import axios from "axios";
import Damage from "./Damage";
import SecondaryEffect from "./SecondaryEffect";

const axiosLink = "https://pokeapi.co/api/v2/move/";

export default async function MoveClick(move, onField, user) {
  const moveEffect = [];
  let attacker;
  let defender;

  if (user === "player") {
    attacker = onField[0];
    defender = onField[1];
  } else {
    attacker = onField[1];
    defender = onField[0];
  }

  const dashedMove = move.replace(/\s+/g, "-");
  const res = await axios.get(axiosLink + dashedMove);
  const info = res.data;

  const moveInfo = {
    dmgClass: info.damage_class.name,
    type: info.type.name,
    power: info.power,
    accuracy: info.accuracy,
    priority: info.priority,
    statChanges: [],
    minHits: info.meta.min_hits,
    maxHits: info.meta.max_hits,
    minTurns: info.meta.min_turns,
    maxTurns: info.meta.max_turns,
    category: info.meta.category.name,
  };

  if (info.dmgClass !== "status") {
    moveEffect.push("Damage");
    const result = await Damage(attacker, defender, moveInfo);
    result.priority = moveInfo.priority;
    if (moveInfo.minHits) {
      let hits =
        Math.floor(Math.random() * (moveInfo.maxHits - moveInfo.minHits + 1)) +
        moveInfo.minHits;
      result.hits = hits;
    }
    if (moveInfo.minTurns) {
      let turns =
        Math.floor(
          Math.random() * (moveInfo.maxTurns - moveInfo.minTurns + 1)
        ) + moveInfo.minTurns;
      result.turns = turns;
    }
    moveEffect.push(result);
    if (moveEffect[1].moveText === "It missed") return moveEffect;
    if (info.effect_chance > 0 || info.meta.drain !== 0) {
      const effect = SecondaryEffect(info);
      if (effect !== undefined) moveEffect.push(effect);
    }
  }

  return moveEffect;
}
