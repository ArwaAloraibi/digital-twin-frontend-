// src/components/Dashboard/Dashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as machineService from '../../services/machineService';

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await machineService.getAllMachines();
        console.log("Fetched machines:", data); // <- add this
        setMachines(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchMachines();
  }, [user]);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>Select a machine to monitor:</p>

      <div className="machine-grid">
        {machines.map(machine => (
          <div
            key={machine.machine_id}
            className="machine-card"
            onClick={() => navigate(`/machines/${machine.machine_id}`)}
          >
            <h3>Machine #{machine.machine_id}</h3>
            <p>Status: {machine.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;

