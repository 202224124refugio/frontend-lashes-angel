import axios from "axios";

export const apiLashes = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
    if (token) {
        apiLashes.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete apiLashes.defaults.headers.common["Authorization"];
    }
};