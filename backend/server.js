require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

/* ========================
   CORS CONFIG (FIXED)
======================== */

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ethara-task-management-s-git-78d817-shivanidiwakar129s-projects.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow tools like Postman / server-to-server
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    credentials: true
}));



/* ========================
   MIDDLEWARE
======================== */

app.use(express.json());

/* ========================
   ROUTES
======================== */

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ========================
   HEALTH CHECK
======================== */

app.get("/", (req, res) => {
    res.send("Backend running - Authentication System");
});

/* ========================
   DATABASE CONNECTION
======================== */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

/* ========================
   START SERVER
======================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});