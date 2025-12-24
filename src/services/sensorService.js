import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/machines`;

export const getMachineSensorData = async (machineId) => {
  const res = await axios.get(`${API_URL}/sensors/${machineId}`);
  return res.data;
};

export const getLatestSensorData = async (machineId) => {
  const res = await axios.get(`${API_URL}/sensors/${machineId}/latest`);
  return res.data;
};