// // src/features/users/api.ts
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export const getUsers = async () => {
//   const response = await axios.get(`${API_URL}/users`);
//   return response.data;
// };

// export const createUser = async (user) => {
//   const response = await axios.post(`${API_URL}/users`, user);
//   return response.data;
// };

// export const updateUser = async (id, user) => {
//   const response = await axios.put(`${API_URL}/users/${id}`, user);
//   return response.data;
// };

// export const deleteUser = async (id) => {
//   await axios.delete(`${API_URL}/users/${id}`);
// };