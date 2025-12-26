import MoveClick from "./MoveClick";

export default async function CompDesc(onField, difficulty) {
  if (difficulty === "Easy") {
    const moveIdx = Math.floor(Math.random() * 4);
    const move = await MoveClick(onField[1].moves[moveIdx], onField, "comp");
    return {
      moveName: onField[1].moves[moveIdx],
      moveInfo: move,
    };
  } else {
    let max = 0;
    let idxMax;
    let totalDmg;

    for (let i = 0; i < 4; i++) {
      const move = await MoveClick(onField[1].moves[i], onField, "comp");

      if (move[1].hits) totalDmg = move[1].damage * move[1].hits;
      else totalDmg = move[1].damage;

      if (totalDmg > max) {
        max = totalDmg;
        idxMax = i;
      }
    }
    const usedMove = await MoveClick(onField[1].moves[idxMax], onField, "comp");
    return {
      moveName: onField[1].moves[idxMax],
      moveInfo: usedMove,
    };
  }
}
