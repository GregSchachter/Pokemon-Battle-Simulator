import { useEffect, useState } from "react";
import "../Styles/TeamPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const link = "https://pokeapi.co/api/v2/pokemon/";
  const url = import.meta.env.VITE_URL;
  const getTeams = async () => {
    setTeams([]);
    const res = await axios.get(`${url}/team`, {
      withCredentials: true,
    });

    const allTeams = await Promise.all(
      res.data.result.map(async (team) => {
        const sprites = await Promise.all(
          team.mons.map(async (mon) => {
            const pokeRes = await axios.get(link + mon.name);
            return pokeRes.data.sprites.front_default;
          }),
        );

        return {
          teamName: team.teamName,
          mons: sprites,
        };
      }),
    );

    setTeams(allTeams);
  };

  useEffect(() => {
    getTeams();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/build");
  };

  const handleEdit = (name, e) => {
    navigate("/edit", {
      state: { teamName: name },
    });
  };

  const handleDelete = async (name, e) => {
    const res = await axios.delete(
      `${url}/team`,
      { data: { name } },
      {
        withCredentials: true,
      },
    );
    getTeams();
  };

  return (
    <>
      <button id="createTeamBtn" onClick={handleClick}>
        Create a New Team
      </button>
      <div>
        <h2>Saved Teams</h2>
        {teams.map((team) => {
          return (
            <div className="savedTeams">
              <h3>{team.teamName}</h3>
              <div className="savedTeamsImg">
                {team.mons.map((mon) => {
                  return <img src={mon} />;
                })}
              </div>
              <button
                className="editTeamBtn"
                onClick={() => handleEdit(team.teamName)}>
                Edit
              </button>
              <button
                className="teamDeleteBtn"
                onClick={() => handleDelete(team.teamName)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
