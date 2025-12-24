// machineService.js
// Handles all API calls related to machines

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/machines`;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const getAllMachines = async () => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.err || 'Failed to fetch machines');

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
