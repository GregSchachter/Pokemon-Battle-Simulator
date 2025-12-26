const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function teamLimit(val) {
  return val.length <= 6;
}

function moveLimit(val) {
  return val.length <= 4;
}

const monSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  moves: {
    type: [String],
    required: true,
    validate: [moveLimit, "A pokemon can only have 4 moves"],
  },
});

const teamSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  teamName: {
    type: String,
    required: true,
  },
  mons: {
    type: [monSchema],
    required: true,
    validate: [teamLimit, "A team cannot contain more than 6 pokemon"],
  },
});

const Team = mongoose.model("team", teamSchema);

module.exports = Team;
