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
  moves: {
    type: [String],
    required: true,
    validate: [moveLimit, "A pokemon can only have 4 moves"],
  },
});

const compSchema = new Schema({
  character: {
    type: String,
    required: true,
  },
  mons: {
    type: [monSchema],
    required: true,
    validate: [teamLimit, "A team cannot contain more than 6 pokemon"],
  },
});

const Comp = mongoose.model("comp", compSchema);

module.exports = Comp;
