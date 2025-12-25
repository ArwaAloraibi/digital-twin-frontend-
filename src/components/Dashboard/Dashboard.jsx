// src/components/Dashboard/Dashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as machineService from '../../services/machineService';
import "./Dashboard.css";

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(""); // selected machine ID
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await machineService.getAllMachines();
        setMachines(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchMachines();
  }, [user]);

  const handleSelectChange = (e) => {
    const machineId = e.target.value;
    setSelectedMachine(machineId);

    if (machineId) {
      navigate(`/machines/${machineId}`); // navigate to the selected machine
    }
  };

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>Select a machine to monitor:</p>

      <div className="machine-select-container">
  <select
    className="machine-select"
    value={selectedMachine}
    onChange={handleSelectChange}
  >
    <option value="">-- Select a Machine --</option>
    {machines.map(machine => (
      <option key={machine.machine_id} value={machine.machine_id}>
        Machine {machine.machine_id} - Status: {machine.status}
      </option>
    ))}
  </select>
</div>

    </main>
  );
};

export default Dashboard;
