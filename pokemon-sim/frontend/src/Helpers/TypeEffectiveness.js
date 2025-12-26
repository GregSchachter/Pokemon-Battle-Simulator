import axios from "axios";

const axiosLink = "https://pokeapi.co/api/v2/type/";

export default async function TypeEffectiveness(defender, moveType) {
  const res = await axios.get(axiosLink + moveType);
  const superEffective = [];
  const notVeryEffective = [];
  const immune = [];

  res.data.damage_relations.double_damage_to.map((type) => {
    superEffective.push(type.name);
  });
  res.data.damage_relations.half_damage_to.map((type) => {
    notVeryEffective.push(type.name);
  });
  res.data.damage_relations.no_damage_to.map((type) => {
    immune.push(type.name);
  });

  let type1 = 1;
  let type2 = 1;
  const defType1 = defender.types[0];
  const typeEffect = {};

  // Check move effectiveness on first type
  if (superEffective.includes(defType1)) {
    type1 = 2;
  } else if (notVeryEffective.includes(defType1)) {
    type1 = 0.5;
  } else if (immune.includes(defType1)) {
    type1 = 0;
  }

  //Check move effectiveness on second type if there is one
  if (defender.types.length > 1) {
    const defType2 = defender.types[1];
    if (superEffective.includes(defType2)) {
      type2 = 2;
    } else if (notVeryEffective.includes(defType2)) {
      type2 = 0.5;
    } else if (immune.includes(defType2)) {
      type2 = 0;
    }
  }

  typeEffect.multi = type1 * type2;
  if (typeEffect.multi > 1) typeEffect.text = "It's super effective";
  else if (typeEffect.multi < 1 && typeEffect.multi > 0)
    typeEffect.text = "It's not very effective";
  else if (typeEffect.multi === 0) typeEffect.text = "It had no effect";
  return typeEffect;
}
