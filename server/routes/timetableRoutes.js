const express = require("express");
const router = express.Router();
const {
  getTimetable,
  createOrUpdateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController.js");
const validateTokenHandler = require("../middleware/validateTokenHandler");

router.use(validateTokenHandler);

router.route("/").get(getTimetable).post(createOrUpdateTimetable).delete(deleteTimetable);    

module.exports = router;
