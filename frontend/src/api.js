import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000",
});

export const uploadFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return client.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const preprocess = (payload) => client.post("/preprocess", payload);
export const splitData = (payload) => client.post("/split", payload);
export const trainModel = (payload) => client.post("/train", payload);