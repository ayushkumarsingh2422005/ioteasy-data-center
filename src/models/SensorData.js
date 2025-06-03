// src/models/SensorData.js
import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  Timestamp: String,
  "Device ID": String,
  Pressure: Number,
  Temperature: Number,
  Humidity: Number,
  Oxygen: Number,
  Sprinkler: String,
  "Exhaust Fan": String,
  Cooler: String,
}, { timestamps: true });

export default mongoose.models.SensorData || mongoose.model("SensorData", SensorDataSchema);
