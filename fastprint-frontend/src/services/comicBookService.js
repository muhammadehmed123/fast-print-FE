// services/comicBookService.js
import axios from "axios";
import { BASE_URL } from "./baseURL"; // import your centralized base URL

const API_BASE = `${BASE_URL}api/comicbook`; // use centralized base URL

export const fetchComicBindings = () =>
  axios.get(`${API_BASE}/bindings/`).then((res) => res.data);

export const updateComicBinding = (id, data) =>
  axios.patch(`${API_BASE}/bindings/${id}/`, data);
