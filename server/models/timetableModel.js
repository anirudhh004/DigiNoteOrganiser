const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  timeSlots: [String],  
  timetable: {
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String]
  }
});

module.exports = mongoose.model("Timetable", timetableSchema);
