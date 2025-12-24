// src/components/Dashboard/Dashboard.jsx

import { useContext, useEffect } from 'react';
import * as userService from '../../services/userService'
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
            key={machine._id}
            className="machine-card"
            onClick={() => navigate(`/machines/${machine._id}`)}
          >
            <h3>{machine.name}</h3>
            <p>Status: {machine.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;

