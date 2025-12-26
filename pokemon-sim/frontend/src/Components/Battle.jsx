import { useEffect, useState } from "react";

import BattleBox from "../Components/BattleBox";
import TeamBox from "../Components/TeamBox";
import InfoBox from "./InfoBox";
import "../Styles/Battle.css";

import MoveClick from "../Helpers/MoveClick";
import CompDesc from "../Helpers/CompDesc";
import Speed from "../Helpers/Speed";
import BegTurnEffect from "../Helpers/BegTurnEffect";

import axios from "axios";
import SecondaryEffectText from "../Helpers/SecondaryEffectText";
import ForfeitBox from "./ForfeitBox";
import ConfusuionDmg from "../Helpers/ConfusionDmg";

const axiosLink = "https://pokeapi.co/api/v2/pokemon/";

function getStat(base, level) {
  return Math.floor(((2 * base + 31) * level) / 100 + 5);
}

function getHp(base, level) {
  return Math.floor(((2 * base + 31) * level) / 100 + level + 10);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Battle({ playerTeam, compTeam, compDifficulty }) {
  const [currPlayerTeam, setCurrPlayerTeam] = useState([]);
  const [currCompTeam, setCurrCompTeam] = useState([]);
  const [onField, setOnField] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState();
  const [phase, setPhase] = useState("idle");
  const [moveQueue, setMoveQueue] = useState([]);
  const [infoBox, setInfoBox] = useState(false);
  const [forfeit, setForfeit] = useState(false);
  const [turn, setTurn] = useState({
    attackerIdx: null,
    defenderIdx: null,
    currMove: null,
  });

  // Get info for both teams
  useEffect(() => {
    const getData = async () => {
      const getTeam = async (team) => {
        const results = [];
        for (let mon of team) {
          const dashedName = mon.name.replace(/\s+/g, "-");
          let res = await axios.get(axiosLink + dashedName);
          results.push({
            pokemon: mon.name,
            level: mon.level,
            types: [
              res.data.types[0].type.name,
              res.data.types[1] ? res.data.types[1].type.name : undefined,
            ],
            frontSprite: res.data.sprites.front_default,
            backSprite: res.data.sprites.back_default,
            moves: [...mon.moves],
            currHp: getHp(res.data.stats[0].base_stat, mon.level),
            maxHp: getHp(res.data.stats[0].base_stat, mon.level),
            atk: getStat(res.data.stats[1].base_stat, mon.level),
            def: getStat(res.data.stats[2].base_stat, mon.level),
            spatk: getStat(res.data.stats[3].base_stat, mon.level),
            spdef: getStat(res.data.stats[4].base_stat, mon.level),
            spe: getStat(res.data.stats[5].base_stat, mon.level),
            statChanges: {
              attack: 0,
              defense: 0,
              "special-attack": 0,
              "special-defense": 0,
              speed: 0,
              accuracy: 0,
              evasion: 0,
            },
            status: [],
          });
        }
        return results;
      };

      const [playerRes, compRes] = await Promise.all([
        getTeam(playerTeam),
        getTeam(compTeam),
      ]);

      setCurrPlayerTeam(playerRes);
      setCurrCompTeam(compRes);
      setOnField([playerRes[0], compRes[0]]);
      setText(`What will ${playerRes[0].pokemon} do?`);
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    // Update the player's team
    setCurrPlayerTeam((prevTeam) =>
      prevTeam.map((mon) =>
        mon.pokemon === onField[0].pokemon
          ? { ...mon, currHp: onField[0].currHp }
          : mon
      )
    );

    // Update the computer's team
    setCurrCompTeam((prevTeam) =>
      prevTeam.map((mon) =>
        mon.pokemon === onField[1].pokemon
          ? { ...mon, currHp: onField[1].currHp }
          : mon
      )
    );
  }, [onField]);

  async function BattlePhase() {
    if (phase === "Lost") {
      await wait(2000);
      setText("You have no more Pokemon that can fight");
      await wait(4000);
      window.location.reload();
      return;
    }
    const { attackerIdx, defenderIdx, currMove } = turn;
    let fainted = false;

    if (
      attackerIdx === null ||
      defenderIdx === null ||
      !currMove ||
      onField.length === 0
    )
      return;
    const attacker = onField[attackerIdx];
    const defender = onField[defenderIdx];

    switch (phase) {
      case "idle":
        break;

      case "Move Used":
        const res = await BegTurnEffect(attacker, currMove);
        if (attacker.status.includes("confusion")) {
          setText(`${attacker.pokemon} is confused`);
          await wait(1000);
        }
        if (res.turn === "skip") {
          if (res.statusTurns) {
            setOnField((prev) =>
              prev.map((mon, idx) =>
                idx === attackerIdx
                  ? {
                      ...mon,
                      status: mon.status.map((s) =>
                        typeof s === "object" && s.name === "sleep"
                          ? { ...s, turns: res.statusTurns }
                          : s
                      ),
                    }
                  : mon
              )
            );
          }
          setText(res.text);
          await wait(1000);
          setPhase("Check if Fainted");
          break;
        }
        if (res.turn === "wake up") {
          setOnField((prev) =>
            prev.map((mon, idx) =>
              idx === attackerIdx
                ? {
                    ...mon,
                    status: mon.status.filter(
                      (s) =>
                        !(
                          s === "sleep" ||
                          (typeof s === "object" && s?.name === "sleep")
                        )
                    ),
                  }
                : mon
            )
          );
          setText(res.text);
          await wait(1000);
        }
        if (res.turn === "confused") {
          const confDmg = await ConfusuionDmg(attacker);
          setOnField((prev) =>
            prev.map((mon, i) => {
              if (i === attackerIdx) {
                return { ...mon, currHp: Math.max(0, mon.currHp - confDmg) };
              }
              return mon;
            })
          );

          setOnField((prev) =>
            prev.map((mon, idx) =>
              idx === attackerIdx
                ? {
                    ...mon,
                    status: mon.status.map((s) =>
                      typeof s === "object" && s.name === "confusion"
                        ? { ...s, turns: res.statusTurns }
                        : s
                    ),
                  }
                : mon
            )
          );
          const confSprite =
            attackerIdx === 1
              ? document.getElementById("compSprite")
              : document.getElementById("playerSprite");
          confSprite.classList.add("flash");
          await new Promise((res) => setTimeout(res, 600));
          confSprite.classList.remove("flash");

          setText(res.text);
          await wait(1000);
          setPhase("Check if Fainted");
          break;
        }
        if (res.turn === "snap out") {
          setOnField((prev) =>
            prev.map((mon, idx) =>
              idx === attackerIdx
                ? {
                    ...mon,
                    status: mon.status.filter(
                      (s) =>
                        !(
                          s === "confusion" ||
                          (typeof s === "object" && s?.name === "confusion")
                        )
                    ),
                  }
                : mon
            )
          );
          setText(res.text);
          await wait(1000);
        }
        if (res.turn === "thawed") {
          setOnField((prev) =>
            prev.map((mon, idx) =>
              idx === attackerIdx
                ? {
                    ...mon,
                    status: mon.status.filter((s) => s !== "freeze"),
                  }
                : mon
            )
          );
          setText(res.text);
          await wait(1000);
        }
        setText(`${attacker.pokemon} used ${currMove[0]}`);
        setPhase("Apply Damage");
        break;

      case "Apply Damage": {
        const hits = currMove[2].hits || 1;
        const dmg = currMove[2].damage;

        const targetSprite =
          attackerIdx === 0
            ? document.getElementById("compSprite")
            : document.getElementById("playerSprite");

        for (let j = 0; j < hits; j++) {
          setOnField((prev) =>
            prev.map((mon, i) => {
              if (i === defenderIdx) {
                return { ...mon, currHp: Math.max(0, mon.currHp - dmg) };
              }
              return mon;
            })
          );

          if (dmg > 0 && targetSprite) {
            targetSprite.classList.add("flash");
            await new Promise((res) => setTimeout(res, 600));
            targetSprite.classList.remove("flash");
          }
          await wait(1000);
        }

        if (hits > 1 && dmg > 0) {
          setText(`${attacker.pokemon} hit ${hits} times!`);
          await wait(1000);
        }

        setPhase("Type Effectiveness");
        break;
      }

      case "Type Effectiveness":
        if (currMove[2].moveText) {
          setText(currMove[2].moveText);
          await wait(1000);
        }
        if (currMove[2].crit) {
          setText(currMove[2].crit);
          await wait(1000);
        }
        setPhase("Secondary Effects");

        break;

      case "Secondary Effects": {
        const effectApplies = currMove.length !== 3;
        if (!effectApplies || currMove[2].moveText === "It had no effect") {
          if (moveQueue.length < 2) {
            for (let k = 0; k < 2; k++) {
              if (onField[k].currHp > 0 && onField[k].status.includes("burn")) {
                const dmg = Math.floor(onField[k].maxHp / 8);
                setOnField((prev) =>
                  prev.map((mon, i) =>
                    i === k
                      ? { ...mon, currHp: Math.max(0, mon.currHp - dmg) }
                      : mon
                  )
                );
                setText(`${onField[k].pokemon} was hurt by it's burn`);
                await wait(1000);
              } else if (
                onField[k].currHp > 0 &&
                onField[k].status.includes("poison")
              ) {
                const dmg = Math.floor(onField[k].maxHp / 16);
                setOnField((prev) =>
                  prev.map((mon, i) =>
                    i === k
                      ? { ...mon, currHp: Math.max(0, mon.currHp - dmg) }
                      : mon
                  )
                );
                setText(`${onField[k].pokemon} was hurt by it's poison`);
                await wait(1000);
              }
            }
          }
          setPhase("Check if Fainted");
          break;
        }
        const effectText = SecondaryEffectText(
          onField[attackerIdx],
          onField[defenderIdx],
          currMove
        );
        // Normal status
        const mutuallyExclusive = [
          "sleep",
          "burn",
          "poison",
          "paralysis",
          "freeze",
        ];
        let eff = currMove[3];
        for (let j = 0; j < currMove[3].length; j++) {
          if (typeof eff[j] === "string") {
            if (onField[defenderIdx].currHp > 0) {
              setOnField((prev) =>
                prev.map((mon, i) => {
                  if (i !== defenderIdx) return mon;

                  if (mutuallyExclusive.includes(eff[j])) {
                    if (mon.status.includes(eff[j])) return mon;

                    if (eff[j] === "sleep") {
                      if (mon.status.includes("sleep")) {
                        return mon;
                      }

                      return {
                        ...mon,
                        status: [
                          ...mon.status,
                          "sleep",
                          { name: "sleep", turns: 4 },
                        ],
                      };
                    }

                    return { ...mon, status: [...mon.status, eff[j]] };
                  } else if (eff[j] === "confusion") {
                    const confTurns = Math.floor(Math.random() * 4) + 2;
                    if (mon.status.includes("confusion")) {
                      return mon;
                    }

                    return {
                      ...mon,
                      status: [
                        ...mon.status,
                        "confusion",
                        { name: "confusion", turns: confTurns },
                      ],
                    };
                  } else if (eff[j] === "trap") {
                    const trapTurns = Math.floor(Math.random() * 4) + 2;
                    if (mon.status.includes("trap")) {
                      return mon;
                    }

                    return {
                      ...mon,
                      status: [
                        ...mon.status,
                        "trap",
                        { name: "trap", turns: trapTurns },
                      ],
                    };
                  } else {
                    return { ...mon, status: [...mon.status, eff[j]] };
                  }
                })
              );
            }
          }
          if (effectText.length > 0) {
            for (let text of effectText) {
              setText(text);
              await wait(1000);
            }
          }
        }
        // drain
        if (currMove[3][0].type === "drain") {
          const heal = Math.floor(
            (currMove[2].damage * currMove[3][0].percent) / 100
          );
          setText(`${attacker.pokemon} restored some health`);
          setOnField((prev) =>
            prev.map((mon, i) =>
              i === attackerIdx
                ? { ...mon, currHp: Math.min(mon.maxHp, mon.currHp + heal) }
                : mon
            )
          );
          await wait(1000);
        }
        // recoil
        if (currMove[3][0].type === "recoil") {
          const recoil = Math.floor(
            currMove[2].damage * Math.abs(currMove[3][0].percent / 100)
          );
          setText(`${attacker.pokemon} took recoil damage`);
          setOnField((prev) =>
            prev.map((mon, i) =>
              i === attackerIdx
                ? { ...mon, currHp: Math.max(0, mon.currHp - recoil) }
                : mon
            )
          );
          await wait(1000);
        }

        // Finch
        if (
          currMove[3].includes("flinch") &&
          moveQueue.length > 0 &&
          onField[defenderIdx].currHp > 0
        ) {
          setText(`${defender.pokemon} flinched!`);
          await wait(1000);
          setMoveQueue([]);
          setPhase("Check if Fainted");
          break;
        }

        // Stats
        const target = eff[0].target === "user" ? attackerIdx : defenderIdx;
        const targetMon = onField[target];

        if (targetMon.currHp > 0 && eff[0].stats) {
          setOnField((prev) =>
            prev.map((mon, i) => {
              if (i !== target) return mon;
              const updatedStatChanges = { ...mon.statChanges };
              eff[0].stats.forEach(({ stat, changeAmount }) => {
                const newValue = updatedStatChanges[stat] + changeAmount;

                updatedStatChanges[stat] = Math.max(-6, Math.min(6, newValue));
              });
              return { ...mon, statChanges: updatedStatChanges };
            })
          );
        }

        // Burn/Poison/Trap Effect
        console.log(attacker);
        if (moveQueue.length < 2) {
          for (let k = 0; k < 2; k++) {
            if (onField[k].status.includes("burn")) {
              const dmg = Math.floor(onField[k].maxHp / 8);
              setOnField((prev) =>
                prev.map((mon, i) =>
                  i === k
                    ? { ...mon, currHp: Math.max(0, mon.currHp - dmg) }
                    : mon
                )
              );
              setText(`${onField[k].pokemon} was hurt by it's burn`);
              await wait(1000);
            } else if (onField[k].status.includes("poison")) {
              const dmg = Math.floor(onField[k].maxHp / 16);
              setOnField((prev) =>
                prev.map((mon, i) =>
                  i === k
                    ? { ...mon, currHp: Math.max(0, mon.currHp - dmg) }
                    : mon
                )
              );
              setText(`${onField[k].pokemon} was hurt by it's poison`);
              await wait(1000);
            }

            if (onField[k].status.includes("trap")) {
              const trapTurns = onField[k].status.find(
                (s) => s.name === "trap"
              );
              console.log(trapTurns);
              if (trapTurns.turns > 0) {
                const dmg = Math.floor(onField[k].maxHp / 16);
                setOnField((prev) =>
                  prev.map((mon, i) =>
                    i === k
                      ? { ...mon, currHp: Math.max(0, mon.currHp - dmg) }
                      : mon
                  )
                );

                const remTurns = trapTurns.turns - 1;
                setOnField((prev) =>
                  prev.map((mon, idx) =>
                    idx === k
                      ? {
                          ...mon,
                          status: mon.status.map((s) =>
                            typeof s === "object" && s.name === "trap"
                              ? { ...s, turns: remTurns }
                              : s
                          ),
                        }
                      : mon
                  )
                );

                setText(`${onField[k].pokemon} was hurt by the trap`);
                await wait(1000);
              } else if (trapTurns.turns <= 0) {
                setOnField((prev) =>
                  prev.map((mon, idx) =>
                    idx === k
                      ? {
                          ...mon,
                          status: mon.status.filter(
                            (s) =>
                              !(
                                s === "trap" ||
                                (typeof s === "object" && s?.name === "trap")
                              )
                          ),
                        }
                      : mon
                  )
                );
                setText(`${onField[k].pokemon} was freed from the trap`);
                await wait(1000);
              }
            }
          }
        }
        setPhase("Check if Fainted");

        break;
      }

      case "Check if Fainted":
        if (
          onField[defenderIdx].currHp <= 0 ||
          onField[attackerIdx].currHp <= 0
        ) {
          setPhase("Pokemon Fainted");
        } else {
          const [, ...remaining] = moveQueue;
          if (remaining.length > 0) {
            setMoveQueue(remaining);
            setTurn(remaining[0]);
            setPhase("Move Used");
          } else {
            setMoveQueue([]);
            setText(`What will ${onField[0].pokemon} do?`);
            setPhase("idle");
          }
        }
        break;

      case "Pokemon Fainted":
        if (onField[defenderIdx].currHp <= 0) {
          setText(`${onField[defenderIdx].pokemon} has fainted.`);
          setMoveQueue([]);
        }
        if (onField[attackerIdx].currHp <= 0) {
          setText(`${onField[attackerIdx].pokemon} has fainted.`);
          setMoveQueue([]);
        }

        if (defenderIdx === 0) {
          await wait(3000);
          const allMonFainted = currPlayerTeam.every((mon) => mon.currHp === 0);
          if (allMonFainted) {
            console.log("Here");
            setPhase("Lost");
            break;
          }
          setText(`Who would you like to send out next?`);
          setPhase("Player Fainted");
        } else {
          await wait(3000);
          for (let i = 0; i < currCompTeam.length; i++) {
            if (onField[1].pokemon === currCompTeam[i].pokemon) {
              if (i === currCompTeam.length - 1) {
                setText("Congratulations! You Won!");
              } else {
                setOnField((prev) =>
                  prev.map((mon, j) => (j === 1 ? currCompTeam[i + 1] : mon))
                );
                setText(`${currCompTeam[i + 1].pokemon} was sent out!`);
                await wait(1000);
                setText(`What will ${onField[0].pokemon} do?`);
                setPhase("idle");
              }
            }
          }
        }
        break;

      case "Lost":
        setText("You have no more Pokemon that can fight");
        await wait(4000);
        window.location.reload();
        return;
    }
  }

  // Run Move Logic
  useEffect(() => {
    (async () => {
      await BattlePhase();
    })();
  }, [phase, turn]);

  //Player clicks a move
  const moveClick = async (move) => {
    const playerMoveRes = await MoveClick(move, onField, "player");
    const compMoveRes = await CompDesc(onField, compDifficulty);
    const firstToMove = Speed(onField, playerMoveRes, compMoveRes.moveInfo);
    const fasterMon = firstToMove === "Player" ? 0 : 1;
    const slowerMon = firstToMove === "Player" ? 1 : 0;
    const fasterMove = {
      attackerIdx: fasterMon,
      defenderIdx: slowerMon,
      currMove:
        firstToMove === "Player"
          ? [move, ...playerMoveRes]
          : [compMoveRes.moveName, ...compMoveRes.moveInfo],
    };
    const slowerMove = {
      attackerIdx: slowerMon,
      defenderIdx: fasterMon,
      currMove:
        firstToMove === "Player"
          ? [compMoveRes.moveName, ...compMoveRes.moveInfo]
          : [move, ...playerMoveRes],
    };
    setMoveQueue([fasterMove, slowerMove]);
    setTurn(fasterMove);
    setPhase("Move Used");
  };

  const switchMon = async (mon) => {
    if (phase === "idle") {
      if (mon === onField[0].pokemon) {
        setText(`${mon} is already on the battlefield!`);
        await wait(2000);
        setText(`What will ${mon} do?`);
        return;
      }

      for (let [idx, teamMemeber] of currPlayerTeam.entries()) {
        if (mon === teamMemeber.pokemon) {
          if (teamMemeber.currHp <= 0) {
            setText(`${mon} is unable to fight`);
            await wait(2000);
            setText(`What will ${mon} do?`);
            return;
          } else {
            setPhase("Switching");
            setOnField((prev) =>
              prev.map((mon, idx) =>
                idx === 0
                  ? {
                      ...mon,
                      status: mon.status.filter(
                        (s) =>
                          !(
                            s === "confusion" ||
                            (typeof s === "object" && s?.name === "confusion")
                          )
                      ),
                    }
                  : mon
              )
            );
            const compMove = await CompDesc(onField, compDifficulty);
            setOnField((prev) =>
              prev.map((m, i) => (i === 0 ? currPlayerTeam[idx] : m))
            );
            setText(`${mon} was sent out!`);
            const field = [currPlayerTeam[idx], onField[1]];
            const compMoveRes = await MoveClick(
              compMove.moveName,
              field,
              "comp"
            );
            console.log(compMoveRes);
            const move = {
              attackerIdx: 1,
              defenderIdx: 0,
              currMove: [compMove.moveName, ...compMoveRes],
            };
            await wait(1000);
            setMoveQueue([move]);
            setTurn(move);
            setPhase("Move Used");
          }
        }
      }
    } else if (phase === "Player Fainted") {
      for (let [idx, teamMemeber] of currPlayerTeam.entries()) {
        if (mon === teamMemeber.pokemon) {
          if (teamMemeber.currHp <= 0) {
            setText(`${mon} is unable to fight`);
            await wait(2000);
            setText(`Who would you like to send out next?`);
            return;
          } else {
            setPhase("Switching");
            setOnField((prev) =>
              prev.map((m, i) => (i === 0 ? currPlayerTeam[idx] : m))
            );
            setText(`${mon} was sent out!`);
            await wait(1000);
            setText(`What will ${mon} do?`);
            setPhase("idle");
          }
        }
      }
    }
  };

  const infoBtn = () => {
    setInfoBox(true);
  };

  const closeInfo = () => {
    setInfoBox(false);
  };

  const clickForfeit = () => {
    setForfeit(true);
  };

  const closeForfeit = (ans) => {
    setForfeit(false);
    if (ans === "yes") {
      setMoveQueue([]);
      setTurn({
        attackerIdx: null,
        defenderIdx: null,
        currMove: null,
      });
      setText("You have forfeitted the battle");
      setPhase("Lost");
    }
  };

  return (
    <>
      {loading === false ? (
        <div id="battle">
          <BattleBox
            playerMon={onField[0]}
            compMon={onField[1]}
            battleText={text}
            moveClick={moveClick}
            infoBtn={infoBtn}
            forfeit={clickForfeit}
            phase={phase}
          />
          <TeamBox playerTeam={currPlayerTeam} switchMon={switchMon} />
          {infoBox === true ? (
            <InfoBox onField={onField} closeInfo={closeInfo} />
          ) : null}
          {forfeit === true ? <ForfeitBox close={closeForfeit} /> : null}
        </div>
      ) : (
        <img
          id="loading"
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8d6cfe44-5fe9-4aaf-9cde-700622aa927d/dccwm24-630b8838-739d-419f-9c32-68bf84d971ab.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi84ZDZjZmU0NC01ZmU5LTRhYWYtOWNkZS03MDA2MjJhYTkyN2QvZGNjd20yNC02MzBiODgzOC03MzlkLTQxOWYtOWMzMi02OGJmODRkOTcxYWIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.mJwioD8jJ2KIseJFROf0jXK_xzpT2khA9dmwmgdgehc"
        />
      )}
    </>
  );
}
