export default function TeamValidation(team, pokemon, moves) {
  const totalErrors = [];
  for (let i = 0; i < 6; i++) {
    let error;
    // Is anything filled out
    if (
      team[i].name === "" &&
      team[i].level === "" &&
      team[i].move1 === "" &&
      team[i].move2 === "" &&
      team[i].move3 === "" &&
      team[i].move4 === ""
    ) {
      error = "empty";
    }
    // At least 1 pokemon is fully complete
    else if (
      team[i].name === "" ||
      team[i].level === "" ||
      (team[i].move1 === "" &&
        team[i].move2 === "" &&
        team[i].move3 === "" &&
        team[i].move4 === "")
    ) {
      error = "need 1 pokemon";
    }
    // Pokemon is a legit pokemon
    else if (!pokemon.includes(team[i].name)) {
      error = "Pokemon";
    }
    // Levels are between 1 and 100
    else if (team[i].level < 1 || team[i].level > 100) {
      error = "Level";
    }
    // Moves are part of learnset
    else if (team[i].move1 !== "" && !moves[i].includes(team[i].move1)) {
      error = "Moves";
    } else if (team[i].move2 !== "" && !moves[i].includes(team[i].move2)) {
      error = "Moves";
    } else if (team[i].move3 !== "" && !moves[i].includes(team[i].move3)) {
      error = "Moves";
    } else if (team[i].move4 !== "" && !moves[i].includes(team[i].move4)) {
      error = "Moves";
    }

    totalErrors.push(error);
  }

  let val;
  if (totalErrors.every((e) => e === "empty"))
    val = "At least 1 Pokemon, level, and 1 move must be filled out";
  else if (totalErrors.includes("need 1 pokemon"))
    val = "At least 1 Pokemon, level, and 1 move must be filled out";
  else if (totalErrors.includes("Pokemon")) val = "Pokemon must be real";
  else if (totalErrors.includes("Level"))
    val = "Levels must be between 1 and 100";
  else if (totalErrors.includes("Moves"))
    val = "Moves must be part of the Pokemon's learn set";

  console.log(val);
  return val;
}
