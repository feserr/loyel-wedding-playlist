import axios from "axios";

const baseWeddingBackendClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

const weddingBackendClient = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export { baseWeddingBackendClient, weddingBackendClient }
