import { useState, useEffect } from "react";
import axios from "axios";

import Battle from "../Components/Battle";

import "../Styles/BattlePage.css";
import "../Styles/BattleBox.css";

export default function BattlePage() {
  const [valid, setValid] = useState(false);
  const [teams, setTeams] = useState([]);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [compTeam, setCompTeam] = useState([]);

  const [formInfo, setFormInfo] = useState({
    team: "",
    trainer: "",
    difficulty: "",
  });

  const trainers = ["Cynthia", "trap test2"];

  useEffect(() => {
    async function getTeams() {
      setTeams([]);
      const res = await axios.get("http://localhost:3000/team", {
        withCredentials: true,
      });
      const playerTeams = res.data.result.map((team) => {
        return { name: team.teamName, mon: team.mons };
      });
      setTeams(playerTeams);
    }
    getTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const choosenTeam = teams.filter((team) => team.name === formInfo.team);
    let highestLvl = 1;
    for (let mon of choosenTeam[0].mon) {
      playerTeam.push(mon);
      highestLvl = Math.max(mon.level, highestLvl);
    }
    const res = await axios.get("http://localhost:3000/trainer", {
      params: { name: formInfo.trainer },
      withCredentials: true,
    });
    const trainerTeam = res.data.result[0].mons;
    for (let mon of trainerTeam) {
      const currMon = {
        name: mon.name,
        level: highestLvl,
        moves: [...mon.moves],
      };
      compTeam.push(currMon);
    }
    setValid(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInfo((info) => ({
      ...info,
      [name]: value,
    }));
  };

  return !valid ? (
    <form id="battlePageForm" onSubmit={handleSubmit}>
      <label htmlFor="team">Team:</label>
      <select required name="team" onChange={handleChange}>
        <option value="" disabled selected>
          Choose a Team
        </option>
        {teams.map((team) => (
          <option key={team.name} value={team.name}>
            {team.name}
          </option>
        ))}
      </select>
      <hr />
      <label htmlFor="trainer">Trainer:</label>
      <select required name="trainer" onChange={handleChange}>
        <option value="" disabled selected>
          Choose a Trainer
        </option>
        {trainers.map((trainer) => (
          <option key={trainer} value={trainer}>
            {trainer}
          </option>
        ))}
      </select>
      <label htmlFor="difficulty">Difficulty:</label>
      <select required name="difficulty" onChange={handleChange}>
        <option value="" disabled selected>
          Choose a Difficulty
        </option>
        <option value="Easy">Easy</option>
        <option value="Hard">Hard</option>
      </select>
      <button type="submit" className="buildFormBtn">
        Battle!
      </button>
    </form>
  ) : (
    <div>
      <Battle
        playerTeam={playerTeam}
        compTeam={compTeam}
        compDifficulty={formInfo.difficulty}
      />
    </div>
  );
}
