
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/sensors`;
import axios from "axios";

export const getMachineSensorData = async (machineId) => {
  const res = await axios.get(`${BASE_URL}/${machineId}`);
  return res.data;
};

export const getLatestSensorData = async (machineId) => {
  const res = await axios.get(`${BASE_URL}/${machineId}/latest`);
  return res.data;
};