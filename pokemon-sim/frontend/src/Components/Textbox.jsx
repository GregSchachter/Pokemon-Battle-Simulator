import "../Styles/TextBox.css";

export default function Textbox({
  text,
  moves,
  moveClick,
  phase,
  infoBtn,
  forfeit,
}) {
  return (
    <div id="battleTextBox">
      <div id="topRow">
        <div id="intTextBox">{text}</div>
        {phase === "idle" && (
          <div id="topButtons">
            <button id="infoBtn" onClick={() => infoBtn()}>
              Battle Info
            </button>
            <button id="forfeitBtn" onClick={() => forfeit()}>
              Forfeit
            </button>
          </div>
        )}
      </div>

      {phase === "idle" && (
        <div id="moveBtnContainer">
          {moves.map((move) => (
            <button
              key={move}
              className="moveBtn"
              id={move}
              onClick={() => moveClick(move)}>
              {move}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
