import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import * as sensorService from "../../services/sensorService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import "./MachineDetails.css";

const MachineDetails = () => {
  const { machine_id } = useParams();

  const [machine, setMachine] = useState();
  const [sensorData, setSensorData] = useState([]);
  const [latest, setLatest] = useState();
  const [streaming, setStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState();

  /* ================= FETCH MACHINE ================= */
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

  /* ================= FETCH SENSOR DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorService.getMachineSensorData(machine_id);
        const withId = data.map((d, i) => ({ ...d, id: i + 1 }));
        setSensorData(withId);
        if (withId.length) setLatest(withId[withId.length - 1]);
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

  /* ================= STREAMING ================= */
  const startStream = async () => {
    if (streaming) return;

    await axios.post(
      `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/machines/${machine_id}/start`
    );

    const id = setInterval(async () => {
      const latestData = await sensorService.getLatestSensorData(machine_id);
      const newPoint = { ...latestData, id: sensorData.length + 1 };

      setSensorData((prev) => [...prev.slice(-19), newPoint]);
      setLatest(newPoint);
      triggerAlerts(newPoint);
    }, 2000);

    setIntervalId(id);
    setStreaming(true);
  };

  const stopStream = () => {
    clearInterval(intervalId);
    setStreaming(false);
  };

  if (!latest) return <p>Loading...</p>;

  const errorRate = latest.error_rate_pct ?? 0;
  const efficiencyRate = latest.efficiency_rate_pct ?? 0;

 const efficiencyStatus = latest.efficiency_status ?? "Unknown";

let efficiencyColor = "#22c55e"; // green
if (efficiencyStatus === "Medium") efficiencyColor = "#facc15"; // yellow
if (efficiencyStatus === "Low") efficiencyColor = "#ef4444"; // red

const pieData = [
  { name: "Efficiency", value: efficiencyRate, color: efficiencyColor },
  { name: "Remaining", value: 100 - efficiencyRate, color: "#e5e7eb" }
];
  return (
    <main>
      <h2 style={{ textAlign: "center" }}>Machine #{machine_id}</h2>

      {/* ================= INFO CARDS (ONE LINE) ================= */}
      <div className="info-cards">
        <div className="card comments">
          <span>Status</span>
          <p>{machine?.status ?? "Unknown"}</p>
        </div>

        <div className="card followers">
          <span>Temperature</span>
          <p>{latest.temperature.toFixed(2)}°C</p>
        </div>

        <div className="card views">
          <span>Power</span>
          <p>{latest.power_consumption_kw.toFixed(2)} kW</p>
        </div>

        <div className="card notification">
          <span>Error Rate</span>
          <p>{errorRate.toFixed(2)}%</p>
        </div>

        <div className="card followers">
          <span>Efficiency</span>
        <p>{latest.efficiency_status}</p>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="actions">
        <button onClick={startStream} disabled={streaming}>
          Start Digital Twin
        </button>
        <button onClick={stopStream} disabled={!streaming}>
          Stop Digital Twin
        </button>
      </div>

      {/* ================= CHARTS ROW ================= */}
      <div className="charts-grid">
        {/* LINE CHART */}
        <div className="chart-container">
          <h3>Temperature Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


      </div>
    </main>
  );
};

export default MachineDetails;













