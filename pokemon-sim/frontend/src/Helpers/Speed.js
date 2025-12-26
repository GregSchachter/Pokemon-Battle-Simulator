export default function Speed(onField, playerMove, compMove) {
  let playerSpeedStat;
  let compSpeedStat;

  if (onField[0].statChanges.speed >= 0) {
    playerSpeedStat = (onField[0].spe * (onField[0].statChanges.speed + 2)) / 2;
  } else {
    playerSpeedStat =
      (onField[0].spe * 2) / (Math.abs(onField[0].statChanges.speed) + 2);
  }

  if (onField[1].statChanges.speed >= 0) {
    compSpeedStat = (onField[1].spe * (onField[1].statChanges.speed + 2)) / 2;
  } else {
    compSpeedStat =
      (onField[1].spe * 2) / (Math.abs(onField[1].statChanges.speed) + 2);
  }

  if (onField[0].status.includes("paralysis"))
    playerSpeedStat = playerSpeedStat / 2;
  if (onField[1].status.includes("paralysis")) {
    compSpeedStat = compSpeedStat / 2;
  }

  let firstToMove;
  if (playerMove[1].priority > compMove[1].priority) firstToMove = "Player";
  else if (playerMove[1].priority < compMove[1].priority) firstToMove = "Comp";
  else
    playerSpeedStat > compSpeedStat
      ? (firstToMove = "Player")
      : (firstToMove = "Comp");

  return firstToMove;
}
