import axios from "axios";

export default async function BegTurnEffect(mon, move) {
  const result = {};
  const res = await axios.get(`https://pokeapi.co/api/v2/move/${move[0]}`);
  const type = res.data.type.name;

  if (mon.status.includes("paralysis")) {
    let paraChance = Math.floor(Math.random() * 4);
    if (paraChance === 0) {
      result.turn = "skip";
      result.text = `${mon.pokemon} is paralyzed! It can't move!`;
    }
  }

  if (mon.status.includes("sleep")) {
    const sleepTurns = mon.status.find((s) => s.name === "sleep");
    const remTurns = sleepTurns.turns - 1;
    if (remTurns <= 0) {
      result.turn = "wake up";
      result.text = `${mon.pokemon} woke up!`;
    } else if (remTurns < 3) {
      const chance = Math.floor(Math.random() * 4);
      if (chance === 0) {
        result.turn = "wake up";
        result.text = `${mon.pokemon} woke up!`;
      } else {
        result.turn = "skip";
        result.text = `${mon.pokemon} is fast asleep!`;
        result.statusTurns = remTurns;
      }
    } else if (remTurns === 3) {
      result.turn = "skip";
      result.text = `${mon.pokemon} is fast asleep!`;
      result.statusTurns = remTurns;
    }
  }

  if (mon.status.includes("confusion")) {
    const confTurns = mon.status.find((s) => s.name === "confusion");
    const remTurns = confTurns.turns - 1;
    if (remTurns <= 0) {
      result.turn = "snap out";
      result.text = `${mon.pokemon} snapped out of confusion`;
    } else {
      const chance = Math.floor(Math.random() * 3);
      if (chance === 0) {
        result.turn = "confused";
        result.text = `${mon.pokemon} hurt itself in confusion`;
        result.statusTurns = remTurns;
      }
    }
  }
  if (mon.status.includes("freeze")) {
    const chance = Math.floor(Math.random() * 5);
    if (chance === 0 || type === "fire") {
      result.turn = "thawed";
      result.text = `${mon.pokemon} thawed out!`;
    } else {
      result.turn = "skip";
      result.text = `${mon.pokemon} is frozen solid!`;
    }
  }

  return result;
}
