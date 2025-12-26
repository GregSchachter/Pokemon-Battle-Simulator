import PlayerPokemon from "./PlayerPokemon";
import TextBox from "../Components/Textbox";
import "../Styles/BattleBox.css";
import CompPokemon from "./CompPokemon";

export default function BattleBox({
  playerMon,
  compMon,
  battleText,
  moveClick,
  infoBtn,
  forfeit,
  phase,
}) {
  const moves = [...playerMon.moves];
  return (
    <div id="battleBox">
      <PlayerPokemon id="playerPokemon" pokemon={playerMon} />
      <CompPokemon id="compPokemon" pokemon={compMon} />
      <TextBox
        moves={moves}
        text={battleText}
        moveClick={moveClick}
        infoBtn={infoBtn}
        forfeit={forfeit}
        phase={phase}
      />
    </div>
  );
}
