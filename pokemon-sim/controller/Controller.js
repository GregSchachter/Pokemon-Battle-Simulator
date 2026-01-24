const User = require("../models/User");
const Team = require("../models/Team");
const Comp = require("../models/Comp");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

function createToken(id) {
  return jwt.sign({ id }, secret, { expiresIn: 21600 });
}

const handleErrors = (err) => {
  console.log(err.keyValue);
  if (err.code === 11000) {
    if (err.keyValue.email) return "Email is already registered.";
    else if (err.keyValue.username) return "Username is already registered.";
  }

  if (err.errors.email || err.errors.username || err.errors.password)
    return "Email, Username and Password are all required";
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged Out" });
};

module.exports.me_get = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        res.json({ auth: false });
      } else {
        let user = await User.findById(decodedToken.id);
        if (!user) {
          res.json({ auth: false });
        } else {
          res.json({ auth: true, user: user.username });
        }
      }
    });
  } else {
    res.json({ auth: false });
  }
};

module.exports.home_get = async (req, res) => {
  res.send("Server Awake");
};

module.exports.team_get = async (req, res) => {
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;
  try {
    const result = await Team.find({ user: user });
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.trainer_get = async (req, res) => {
  const { name } = req.query;

  try {
    const result = await Comp.find({ character: name });
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.team_get_one = async (req, res) => {
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;
  const { teamName } = req.params;

  try {
    const result = await Team.findOne({
      user,
      teamName,
    });

    if (!result) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.signup_post = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const newUser = await User.create({ email, username, password });
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 21600 * 1000 });
    res.status(201).json({ user: newUser.username });
  } catch (error) {
    const err = handleErrors(error);
    console.log(err);
    res.status(400).json({ error: err });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 21600 * 1000 });
    res.status(201).json({ user: user.username });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.build_post = async (req, res) => {
  const { submittedTeam } = req.body;
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;

  const teamName = submittedTeam[6];

  const mons = submittedTeam
    .slice(0, 6)
    .filter((mon) => mon.name && mon.level)
    .map((mon) => ({
      name: mon.name,
      level: Number(mon.level),
      moves: [mon.move1, mon.move2, mon.move3, mon.move4].filter((m) => m),
    }));

  try {
    const createdTeam = await Team.create({
      user,
      mons,
      teamName,
    });
    res.status(201).json({ message: "Team saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.comp_post = async (req, res) => {
  const { comp } = req.body;
  console.log(comp);

  try {
    const cpu = await Comp.create(comp);
    res.status(201).json({ message: "Team saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.team_delete = async (req, res) => {
  const { name } = req.body;
  try {
    const deleted = await Team.deleteOne({ teamName: name });
    console.log(deleted);
    res.status(201).json({ message: "Team Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.edit_patch = async (req, res) => {
  const { teamId, submittedTeam } = req.body;
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;

  const teamName = submittedTeam[6];

  const mons = submittedTeam
    .slice(0, 6)
    .filter((mon) => mon.name && mon.level)
    .map((mon) => ({
      name: mon.name,
      level: Number(mon.level),
      moves: [mon.move1, mon.move2, mon.move3, mon.move4].filter((m) => m),
    }));

  try {
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: teamId, user },
      {
        mons,
        teamName,
      },
      { new: true, runValidators: true },
    );
    res.status(201).json({ message: "Team saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
