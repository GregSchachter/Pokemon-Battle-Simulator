import PokemonInfoBox from "./PokemonInfoBox";

export default function PlayerPokemon({ pokemon }) {
  const sprite = pokemon.backSprite ? pokemon.backSprite : pokemon.frontSprite;
  return (
    <div id="playerMon">
      <img id="playerSprite" src={sprite}></img>
      <PokemonInfoBox varient="player" pokemon={pokemon} />
    </div>
  );
}
