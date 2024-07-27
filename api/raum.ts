import {Aufgabe} from "@/api/aufgabe";
import {axiosClient} from "@/api/httpClient";
import {AxiosResponse} from "axios";

export type Raum = {
    id: string;
    name: string;
    beschreibung: string;
    aufgaben: Aufgabe[];
}

export const getRoomByIdApi = async (id: string): Promise<AxiosResponse<Raum>> => {
    return await axiosClient.get<Raum>(`/raeume/${id}`);
};

export const getAllRoomsApi = async (): Promise<AxiosResponse<Raum[]>> => {
    return await axiosClient.get<Raum[]>("/raeume/alle");
};

export const updateRoomApi = async (raum: Raum): Promise<void> => {
    const payload = JSON.stringify(raum);
    await axiosClient.put("/raeume", payload);
};
