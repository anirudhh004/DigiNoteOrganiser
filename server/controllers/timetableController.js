const asyncHandler = require("express-async-handler");
const Timetable = require("../models/timetableModel");

// @desc    Get current user's timetable
// @route   GET /api/timetable
// @access  Private
const getTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findOne({ user_id: req.user.id });
  if (!timetable) {
    res.status(404);
    throw new Error("No timetable found");
  }
  console.log("req.user:", req.user);
  res.status(200).json(timetable);
    console.log("exiting");
});

// @desc    Create or update user's timetable
// @route   POST /api/timetable
// @access  Private
const createOrUpdateTimetable = asyncHandler(async (req, res) => {
  const { timeSlots, timetable } = req.body;

  if (
    !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0 ||
    !timetable || typeof timetable !== 'object'
  ) {
    res.status(400);
    throw new Error("Invalid timetable or time slots");
  }
  // Check if user already has a timetable
  const existing = await Timetable.findOne({ user_id: req.user.id });

  if (existing) {
    existing.timeSlots = timeSlots;
    existing.timetable = timetable;
    await existing.save();
    return res.status(200).json(existing);
  }

  console.log("user_id:", req.user?.id);
  console.log("timeSlots:", timeSlots);
  console.log("timetable:", timetable);
  const newTimetable = await Timetable.create({
    user_id: req.user.id,
    timeSlots,
    timetable
  });
  console.log("added or updated");
  res.status(201).json(newTimetable);
});

// @desc    Delete user's timetable
// @route   DELETE /api/timetable
// @access  Private
const deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findOne({ user_id: req.user.id });

  if (!timetable) {
    res.status(404);
    throw new Error("Timetable not found");
  }

  await timetable.deleteOne();
  res.status(200).json({ message: "Timetable deleted successfully" });
});

module.exports = {
  getTimetable,
  createOrUpdateTimetable,
  deleteTimetable
};
