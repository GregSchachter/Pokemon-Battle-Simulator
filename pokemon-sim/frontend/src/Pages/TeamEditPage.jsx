import { useEffect, useState } from "react";
import axios from "axios";
import TeamValidation from "../Helpers/TeamValidation";
import "../Styles/TeamBuildPage.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function TeamEditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState("tab1");
  const [pokemon, setPokemon] = useState([]);
  const [monMoves, setMonMoves] = useState([]);
  const [sprites, setSprites] = useState({});
  const [teamMoves, setTeamMoves] = useState([[], [], [], [], [], []]);
  const [valid, setValid] = useState(true);
  const [valError, setValError] = useState("");
  const [teamId, setTeamId] = useState("");
  const [team, setTeam] = useState([
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    {
      name: "",
      level: "",
      move1: "",
      move2: "",
      move3: "",
      move4: "",
    },
    "",
  ]);

  const reqTeam = state.teamName;
  let idx = Number(activeTab.replace("tab", "")) - 1;
  let mon = team[idx];
  useEffect(() => {
    async function getTeam() {
      const res = await axios.get(`http://localhost:3000/team/${reqTeam}`, {
        withCredentials: true,
      });
      const team = res.data.result.mons;
      setTeamId(res.data.result._id);
      const formattedTeam = team.map((mon) => ({
        name: mon.name,
        level: mon.level,
        move1: mon.moves?.[0] || "",
        move2: mon.moves?.[1] || "",
        move3: mon.moves?.[2] || "",
        move4: mon.moves?.[3] || "",
      }));

      while (formattedTeam.length < 6) {
        formattedTeam.push({
          name: "",
          level: "",
          move1: "",
          move2: "",
          move3: "",
          move4: "",
        });
      }

      formattedTeam.push(reqTeam);
      setTeam(formattedTeam);
    }
    getTeam();
  }, []);

  useEffect(() => {
    async function getPokemon() {
      try {
        const res = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=2000"
        );
        const names = res.data.results.map((p) => p.name);
        setPokemon(names);
      } catch (err) {
        console.log(err);
      }
    }
    getPokemon();
  }, []);

  useEffect(() => {
    const mon = team[idx];
    if (!mon?.name) return;

    const name = mon.name.toLowerCase();

    if (!pokemon.includes(name)) {
      setSprites((prev) => ({ ...prev, [activeTab]: "" }));
      return;
    }

    async function loadPokemon() {
      const { moves, sprite } = await pokemonSelected(name);
      setMonMoves(moves);
      setSprites((prev) => ({ ...prev, [activeTab]: sprite }));
    }

    loadPokemon();
  }, [team[idx]?.name, idx, activeTab]);

  useEffect(() => {
    async function loadAllMoves() {
      if (!team) return;

      const movesArr = await Promise.all(
        team.slice(0, 6).map(async (mon) => {
          if (!mon.name) return [];
          const { moves } = await pokemonSelected(mon.name.toLowerCase());
          return moves;
        })
      );

      setTeamMoves(movesArr);
    }

    loadAllMoves();
  }, [team]);
  const tabs = [
    { id: "tab1", title: "Pokemon 1" },
    { id: "tab2", title: "Pokemon 2" },
    { id: "tab3", title: "Pokemon 3" },
    { id: "tab4", title: "Pokemon 4" },
    { id: "tab5", title: "Pokemon 5" },
    { id: "tab6", title: "Pokemon 6" },
  ];

  const tabChange = (e) => {
    setActiveTab(e.target.id);
  };

  const handleChange = (e) => {
    setValid(true);
    const { name, value } = e.target;

    if (name === "teamName") {
      setTeam((prev) => prev.map((item, i) => (i === 6 ? value : item)));
      return;
    }

    setTeam((prev) =>
      prev.map((mon, i) => (i === idx ? { ...mon, [name]: value } : mon))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = TeamValidation(team, pokemon, teamMoves);
    if (!val) {
      const res = await axios.put(
        "http://localhost:3000/edit",
        { teamId, submittedTeam: team },
        {
          withCredentials: true,
        }
      );
      navigate("/team");
    } else {
      setValError(val);
      setValid(false);
    }
    console.log(valError);
  };

  async function pokemonSelected(monName) {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${monName}`);

    const moveDetails = await Promise.all(
      res.data.moves.map(async (m) => {
        const moveRes = await axios.get(m.move.url);
        return {
          name: m.move.name,
          damage_class: moveRes.data.damage_class.name,
        };
      })
    );

    const bannedMoves = [
      "bide",
      "counter",
      "metal-burst",
      "comeuppance",
      "mirror-coat",
      "blast-burn",
      "eternabeam",
      "frenzy-plant",
      "giga-impact",
      "hydro-cannon",
      "hyper-beam",
      "meteor-assault",
      "prismatic-laser",
      "roar-of-time",
      "rock-wrecker",
      "bounce",
      "dig",
      "dive",
      "electro-shot",
      "fly",
      "freeze-shock",
      "ice-burn",
      "meteor-beam",
      "phantom-force",
      "razor-wind",
      "shadown-force",
      "skull-bash",
      "sky-attack",
      "sky-drop",
      "solar-beam",
      "solar-blade",
      "tri-attack",
      "flail",
      "ice-ball",
      "outrage",
      "petal-dance",
      "raging-fury",
      "rollout",
      "thrash",
      "uproar",
      "dire-claw",
      "focus-blast",
      "endeavor",
      "hidden-power",
    ];

    const filteredMoves = moveDetails
      .filter(
        (m) =>
          (m.damage_class === "physical" || m.damage_class === "special") &&
          !bannedMoves.includes(m.name)
      )
      .map((m) => m.name);

    filteredMoves.sort();

    const i = Number(activeTab[3]) - 1;

    setTeamMoves((prev) => {
      const newMoves = [...prev];
      newMoves[i] = filteredMoves;
      return newMoves;
    });
    const sprite = res.data.sprites.front_default;
    return { moves: filteredMoves, sprite };
  }

  return (
    <div id="buildPage">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.id}
            id={tab.id}
            onClick={tabChange}
            className={`tab${activeTab === tab.id ? "Active" : ""}`}>
            {tab.title}
          </button>
        );
      })}
      {sprites[activeTab] === null ? null : (
        <img className="buildFormSprite" src={sprites[activeTab]} />
      )}
      <form id="buildForm" onSubmit={handleSubmit}>
        <input
          name="teamName"
          type="text"
          placeholder="Team Name"
          value={team[6]}
          onChange={handleChange}
          id="teamInput"
        />
        <hr />
        <input
          name="name"
          type="text"
          placeholder="Pokemon"
          className="pokemonInput"
          value={mon.name}
          onChange={handleChange}
          list="pokemonList"
        />
        <hr />
        <datalist id="pokemonList">
          {pokemon.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <input
          name="level"
          type="number"
          min="1"
          max="100"
          placeholder="Level"
          className="levelInput"
          value={mon.level}
          onChange={handleChange}
        />
        <hr />
        <div>
          <input
            name="move1"
            type="text"
            placeholder="Move"
            value={mon.move1}
            onChange={handleChange}
            className="moveInput"
            list="moveList"
          />
          <input
            name="move2"
            type="text"
            placeholder="Move"
            value={mon.move2}
            onChange={handleChange}
            className="moveInput"
            list="moveList"
          />
          <input
            name="move3"
            type="text"
            placeholder="Move"
            value={mon.move3}
            onChange={handleChange}
            className="moveInput"
            list="moveList"
          />
          <input
            name="move4"
            type="text"
            placeholder="Move"
            value={mon.move4}
            onChange={handleChange}
            className="moveInput"
            list="moveList"
          />
        </div>
        <datalist id="moveList">
          {monMoves.map((move) => (
            <option key={move} value={move} />
          ))}
        </datalist>
        <button className="buildFormBtn" type="submit">
          Update
        </button>
      </form>
      <div id="buildFormError">{valid === false ? valError : null}</div>
    </div>
  );
}
