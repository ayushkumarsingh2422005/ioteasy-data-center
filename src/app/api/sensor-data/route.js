// src/app/api/sensor-data/route.js
import { connectDB } from "@/lib/db";
import SensorData from "@/models/SensorData";

export async function GET() {
  await connectDB();
  const data = await SensorData.find().sort({ createdAt: -1 }).limit(50);
  return Response.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const newData = await SensorData.create(body);
    return Response.json(newData, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
