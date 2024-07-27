import axios, {AxiosInstance} from "axios";

export const axiosClient: AxiosInstance = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
