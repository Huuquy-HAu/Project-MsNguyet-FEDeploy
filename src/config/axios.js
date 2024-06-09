import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://project-msnguyet-api.onrender.com/api/',
});
