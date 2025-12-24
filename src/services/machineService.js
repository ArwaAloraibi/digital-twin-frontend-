// machineService.js
// Handles all API calls related to machines

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/machines`;

// Helper function to get headers with auth token
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// Fetch all machines
export const getAllMachines = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

