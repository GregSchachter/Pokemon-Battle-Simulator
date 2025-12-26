import "../Styles/ForfeitBox.css";

export default function ForfeitBox({ close }) {
  const handleClick = (e) => {
    if (e.target.id === "yes") close("yes");
    else if (e.target.id === "no") close("no");
  };

  return (
    <>
      <div id="modal"></div>
      <div id="forfeitBox">
        <p>Are you sure you want to forfeit?</p>
        <button onClick={handleClick} id="yes">
          Yes
        </button>
        <button onClick={handleClick} id="no">
          No
        </button>
      </div>
    </>
  );
}
