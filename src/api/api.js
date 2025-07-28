import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const registerEmpleado = async (data) => {
  const res = await api.post('/empleados/register', data);
  return res.data;
};

export const getEmpleados = async () => {
  const res = await api.get('/empleados');
  return res.data;
};

export const getEmpleadoById = async (id) => {
  const res = await api.get(`/empleados/${id}`);
  return res.data;
};

export const updateEmpleado = async (id, data) => {
  const res = await api.put(`/empleados/${id}`, data);
  return res.data;
};

export const deleteEmpleado = async (id) => {
  const res = await api.delete(`/empleados/${id}`);
  return res.data;
};

export const getProductos = async () => {
  const res = await api.get('/productos');
  return res.data;
};

export const createProducto = async (producto) => {
  const res = await api.post('/productos', producto);
  return res.data;
};

export const updateProducto = async (id, producto) => {
  const res = await api.put(`/productos/${id}`, producto);
  return res.data;
};

export const deleteProducto = async (id) => {
  const res = await api.delete(`/productos/${id}`);
  return res.data;
};

export const getMiPerfil = async () => {
  const res = await api.get('/empleados/me');
  return res.data;
};

export const updateMiPerfil = async (datos) => {
  const res = await api.put('/empleados/me', datos);
  return res.data;
};