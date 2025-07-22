const express = require("express");
const cors = require("cors");
const timetableRoutes = require("./routes/timetableRoutes"); 
const userRoutes = require("./routes/userRoutes"); 
const itemRoutes = require("./routes/itemRoutes"); 
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const path = require('path');

connectDb();
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use("/uploads", express.static("uploads"));
app.use("/api/timetable", timetableRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/item", itemRoutes);
app.use(errorHandler);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(8080, () => {
  console.log("Server started on port 8080");
});
