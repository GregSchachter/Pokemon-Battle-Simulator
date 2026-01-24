import homePageGif from "../Styles/pictures/homepage.gif";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/HomePage.css";

export default function HomePage() {
  const url = import.meta.env.VITE_URL;

  const [serverAwake, setServerAwake] = useState(false);

  useEffect(() => {
    const wakeServer = async () => {
      let attempts = 0;
      while (!serverAwake && attempts < 5) {
        try {
          await axios.get(`${url}/health`, { withCredentials: true });
          console.log("Server is awake!");
          setServerAwake(true);
        } catch (err) {
          console.warn("Server still sleeping, retrying...");
          attempts++;
          await new Promise((r) => setTimeout(r, 5000)); // wait 5s
        }
      }
    };
    wakeServer();
  }, []);

  if (!serverAwake) return <p>Loading… server is waking up</p>;

  return (
    <div id="homePageDiv">
      <p>Create, Save, and Edit your teams!</p>
      <p>Battle against different known Pokemon NPCs!</p>
      <p>Battle against 2 different trainer difficulties!</p>
      <img src={homePageGif} />
    </div>
  );
}
