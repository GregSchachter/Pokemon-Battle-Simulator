import homePageGif from "../Styles/pictures/homepage.gif";
import "../Styles/HomePage.css";

export default function HomePage() {
  const url = import.meta.env.VITE_URL;

  const pageGet = async () => {
    const res = await axios.get(`${url}/`, {
      withCredentials: true,
    });
  };

  useEffect(() => {
    pageGet();
  }, []);
  return (
    <div id="homePageDiv">
      <p>Create, Save, and Edit your teams!</p>
      <p>Battle against different known Pokemon NPCs!</p>
      <p>Battle against 2 different trainer difficulties!</p>
      <img src={homePageGif} />
    </div>
  );
}
