import PokemonInfoBox from "./PokemonInfoBox";

export default function CompPokemon({ pokemon }) {
  return (
    <div id="compMon">
      <img id="compSprite" src={pokemon.frontSprite}></img>
      <PokemonInfoBox varient="comp" pokemon={pokemon} />
    </div>
  );
}
