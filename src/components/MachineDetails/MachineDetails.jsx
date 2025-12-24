// src/components/MachineDetails/MachineDetails.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import * as machineService from "../../services/machineService";
import * as sensorService from "../../services/sensorService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MachineDetails = () => {
  const { machine_id } = useParams();
  const [sensorData, setSensorData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Fetch all historical sensor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorService.getMachineSensorData(machine_id);
        setSensorData(data);
        if (data.length > 0) setLatest(data[data.length - 1]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [machine_id]);

  // Start streaming latest sensor data
const startStream = async () => {
  if (streaming) return;

  // Trigger backend stream
  try {
    await axios.post(`${import.meta.env.VITE_BACK_END_SERVER_URL}/api/machines/${machine_id}/start`);
    console.log("Backend digital twin stream started");
  } catch (err) {
    console.error("Failed to start backend stream:", err);
    return;
  }

  // Start frontend polling
  const id = setInterval(async () => {
    try {
      const latestData = await sensorService.getLatestSensorData(machine_id);
      setLatest(latestData);
      setSensorData(prev => [...prev, latestData]);
    } catch (err) {
      console.error(err);
    }
  }, 2000);
  setIntervalId(id);
  setStreaming(true);
};

  const stopStream = () => {
    if (intervalId) clearInterval(intervalId);
    setStreaming(false);
  };

  if (!latest) return <p>Loading...</p>;

  const isOverheating = latest.temperature > 75; // use your backend threshold

  return (
    <main>
      <h2>Machine #{machine_id} Details</h2>

      {isOverheating && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠️ Temperature is too high: {latest.temperature}°C
        </p>
      )}

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <p>Status: {latest.status}</p>
        <p>Temperature: {latest.temperature}°C</p>
        <p>Power: {latest.power_consumption_kw} kW</p>
        <p>Latency: {latest.network_latency_ms} ms</p>
        <p>Error rate: {latest.error_rate_pct}%</p>
        <p>Efficiency: {latest.efficiency_status}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={startStream} disabled={streaming}>Start Digital Twin</button>
        <button onClick={stopStream} disabled={!streaming}>Stop Digital Twin</button>
      </div>

      <h3>Temperature Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
};

export default MachineDetails;
