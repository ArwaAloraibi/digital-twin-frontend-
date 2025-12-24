// src/components/MachineDetails/MachineDetails.jsx

import { useParams } from 'react-router';

const MachineDetails = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Machine Details</h1>
      <p>Machine ID: {id}</p>
    </main>
  );
};

export default MachineDetails;
