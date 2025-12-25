// src/components/MachineDetails/MachineDetails.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import * as sensorService from "../../services/sensorService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MachineDetails = () => {
  const { machine_id } = useParams();
  const [machine, setMachine] = useState();
  const [sensorData, setSensorData] = useState([]);
  const [latest, setLatest] = useState();
  const [streaming, setStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/machines/${machine_id}`
        );
        setMachine(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMachine();
  }, [machine_id]);

  // Fetch all historical sensor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorService.getMachineSensorData(machine_id);
        // Add unique id for chart
        const dataWithId = data.map((item, index) => ({ ...item, id: index + 1 }));
        setSensorData(dataWithId);
        if (dataWithId.length > 0) setLatest(dataWithId[dataWithId.length - 1]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [machine_id]);

     const triggerAlerts = (data) => {
    if (data.temperature > 75) {
      toast.error(`🔥 High Temperature: ${data.temperature.toFixed(2)}°C`);
    }
  };
  
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

        // Add id for chart
        const dataWithId = { ...latestData, id: sensorData.length + 1 };

        // Keep only last 20 points for scrolling effect
        setSensorData(prev => [...prev.slice(-19), dataWithId]);
        setLatest(dataWithId);
        
        triggerAlerts(dataWithId);

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

  const isOverheating = latest.temperature > 75;

  
  return (
    <main>
      <h2 style={{ textAlign: "center" }}> Machine #{machine_id}</h2>

     
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <p>Status: {machine.status}</p> 
        <p>Temperature: {latest.temperature.toFixed(2)}°C</p>
        <p>Power: {latest.power_consumption_kw.toFixed(2)} kW</p>
        <p>Latency: {latest.network_latency_ms.toFixed(2)} ms</p>
        <p>Error rate: {latest.error_rate_pct.toFixed(2)}%</p>
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
          <Line type="monotone" dataKey="temperature" stroke="#ff0000" isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
};

export default MachineDetails;
