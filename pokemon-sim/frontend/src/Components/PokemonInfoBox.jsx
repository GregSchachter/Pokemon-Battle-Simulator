import { useEffect, useRef } from "react";
import "../Styles/PokemonInfoBox.css";

import sleepIcon from "../Styles/pictures/AsleepIC_SV.png";
import paraIcon from "../Styles/pictures/ParalysisIC_SV.png";
import poisonIcon from "../Styles/pictures/PoisonedIC_SV.png";
import freezeIcon from "../Styles/pictures/FrozenIC_SV.png";
import burnIcon from "../Styles/pictures/BurnedIC_SV.png";

export default function PokemonInfoBox({ pokemon, varient }) {
  const healthBar = useRef(null);

  const maxHp = pokemon.maxHp;
  let hp = pokemon.currHp;
  let healthPerc = (hp / maxHp) * 100;
  const perc = Math.max(0, healthPerc);
  let imgLink;

  if (pokemon.status.length > 0) {
    if (pokemon.status.includes("paralysis")) imgLink = paraIcon;
    if (pokemon.status.includes("sleep")) imgLink = sleepIcon;
    if (pokemon.status.includes("poison")) imgLink = poisonIcon;
    if (pokemon.status.includes("freeze")) imgLink = freezeIcon;
    if (pokemon.status.includes("burn")) imgLink = burnIcon;
  }

  useEffect(() => {
    healthBar.current.style.width = `${perc}%`;
    if (perc > 50) {
      healthBar.current.style.backgroundColor = "green";
    } else if (perc > 30) {
      healthBar.current.style.backgroundColor = "yellow";
    } else if (perc > 0) {
      healthBar.current.style.backgroundColor = "red";
    }
  }, [healthPerc]);

  return (
    <div className="pokemonInfoBox" id={`${varient}-InfoBox`}>
      <h3>{pokemon.pokemon}</h3>
      <img id="statusImg" src={imgLink}></img>
      <p id="level">Level: {pokemon.level}</p>
      <div id="health-bar-container">
        <div id="health-bar" ref={healthBar}></div>
      </div>
      <p id="health">{`${hp} / ${pokemon.maxHp}`}</p>
    </div>
  );
}
