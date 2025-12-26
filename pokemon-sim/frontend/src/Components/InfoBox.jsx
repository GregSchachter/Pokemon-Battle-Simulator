import "../Styles/InfoBox.css";

export default function InfoBox({ onField, closeInfo }) {
  const handleClick = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    closeInfo();
  };
  const statChangeText = (stat) => {
    if (stat === 0) return "Neutral";
    else if (stat > 0) return `+${stat}`;
    else return stat;
  };
  const statusText = (arr) => {
    if (arr.includes("sleep")) return "Asleep";
    else if (arr.includes("poison")) return "Poisoned";
    else if (arr.includes("paralysis")) return "Paralyzed";
    else if (arr.includes("burn")) return "Burned";
    else if (arr.includes("freeze")) return "Frozen";
    else return "None";
  };
  return (
    <>
      <div id="modal"></div>
      <div id="infoBox">
        <div className="infoBoxInfo">
          <p>Pokemon: {onField[0].pokemon}</p>
          <p>
            Health: {onField[0].currHp}/{onField[0].maxHp}
          </p>
          <p>Attack: {statChangeText(onField[0].statChanges.attack)}</p>
          <p>Defense: {statChangeText(onField[0].statChanges.defense)}</p>
          <p>
            Special Attack:{" "}
            {statChangeText(onField[0].statChanges["special-attack"])}
          </p>
          <p>
            Special Defense:{" "}
            {statChangeText(onField[0].statChanges["special-defense"])}
          </p>
          <p>Speed: {statChangeText(onField[0].statChanges.speed)}</p>
          <p>Status: {statusText(onField[0].status)}</p>
        </div>
        <div className="infoBoxInfo">
          <p>Pokemon: {onField[1].pokemon}</p>
          <p>
            Health: {onField[1].currHp}/{onField[1].maxHp}
          </p>
          <p>Attack: {statChangeText(onField[1].statChanges.attack)}</p>
          <p>Defense: {statChangeText(onField[1].statChanges.defense)}</p>
          <p>
            Special Attack:{" "}
            {statChangeText(onField[1].statChanges["special-attack"])}
          </p>
          <p>
            Special Defense:{" "}
            {statChangeText(onField[1].statChanges["special-defense"])}
          </p>
          <p>Speed: {statChangeText(onField[1].statChanges.speed)}</p>
          <p>Status: {statusText(onField[1].status)}</p>
        </div>
        <button onClick={handleClick}>Close</button>
      </div>
    </>
  );
}
