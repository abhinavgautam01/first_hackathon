import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/////////////////////////////////////////////////////
// Schemas
/////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["driver", "admin"], default: "driver" },
});

const User = mongoose.model("User", userSchema);

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverName: String,
  routeName: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

/////////////////////////////////////////////////////
// Middleware for Auth
/////////////////////////////////////////////////////

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

/////////////////////////////////////////////////////
// AUTH ROUTES
/////////////////////////////////////////////////////

// 1️⃣ Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2️⃣ Signin
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/////////////////////////////////////////////////////
// VEHICLE ROUTES (Protected)
/////////////////////////////////////////////////////

// Check-In (driver only)
app.post("/api/checkin", authMiddleware(["driver"]), async (req, res) => {
  try {
    const { vehicleId, routeName, latitude, longitude } = req.body;
    const driverId = req.user.id;
    const driverName = req.user.username;

    const data = new Vehicle({
      vehicleId,
      driverId,
      driverName,
      routeName,
      latitude,
      longitude,
    });
    await data.save();
    res.json({ success: true, message: "Check-in saved", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Vehicles (any authenticated role)
app.get("/api/vehicles", authMiddleware(), async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    const vehicles = await Vehicle.find({ timestamp: { $gte: cutoff } });
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3️⃣ Get Specific Vehicle by ID
app.get("/api/vehicle/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
    if (!vehicle)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4️⃣ Delete Old Data (cleanup route)
app.delete("/api/cleanup", async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hrs
    await Vehicle.deleteMany({ timestamp: { $lt: cutoff } });
    res.json({ success: true, message: "Old data removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/////////////////////////////////////////////////////
app.listen(3000, () =>
  console.log(`🚀 Server running on port http://localhost:3000`)
);

// 31.690707243428594, 76.48864777433269;

// 32.110920207983604, a;
