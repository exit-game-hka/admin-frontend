import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Interaktion = {
    id: string;
    spielerId: string;
    aufgabeId: string;
    gegenstandId: string;
    action: string;
};

export type InteraktionDto = Omit<Interaktion, "id">;

const ENDPOINT = "/interaktionen" as const;

export const getInteraktionBySpielerIdAndAufgabeIdApi = async (spielerId: string, aufgabeId: string): Promise<AxiosResponse<Interaktion[]>> => {
    return await axiosClient.get<Interaktion[]>(`${ENDPOINT}?spieler_id=${spielerId}&aufgabe_id=${aufgabeId}`);
};

export const createInteraktionApi = async (interaktionDto: InteraktionDto) => {
    const payload = JSON.stringify(interaktionDto);
    return await axiosClient.post(ENDPOINT, payload);
};
