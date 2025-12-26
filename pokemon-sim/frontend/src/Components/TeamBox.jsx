import "../Styles/TeamBox.css";

export default function TeamBox({ playerTeam, switchMon }) {
  const handleClick = (e) => {
    let mon;
    if (e.target.tagName === "IMG") {
      mon = e.target.parentElement.id;
    } else {
      mon = e.target.id;
    }
    switchMon(mon);
  };

  return (
    <div id="teamBox">
      {playerTeam.map((mon) => {
        return (
          <button
            key={mon.pokemon}
            className="teamButtons"
            id={mon.pokemon}
            onClick={handleClick}>
            <img src={mon.frontSprite} />
            <br />
            {mon.currHp}/{mon.maxHp}
          </button>
        );
      })}
    </div>
  );
}
