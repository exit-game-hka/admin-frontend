import axios, {AxiosInstance} from "axios";

export const axiosClient: AxiosInstance = axios.create({
    baseURL: "https://193.196.37.154/exit-game-backend",
    headers: {
        "Content-Type": "application/json",
    },
});