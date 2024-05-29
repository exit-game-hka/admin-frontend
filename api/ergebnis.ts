import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";
import {Spieler} from "@/api/spieler";
import {Aufgabe} from "@/api/aufgabe";

export type Ergebnis = {
    id: string;
    spielerId: string;
    spieler: Spieler;
    aufgabeId: string;
    aufgabe: Aufgabe;
    semesterId: string;
    geloestIn?: number | undefined | null;
};

export type ErgebnisDto = Omit<Ergebnis, "id">;

const ENDPOINT = "/ergebnisse" as const;

export const getErgebnisByAufgabeIdAndSpielerIdApi = async (aufgabeId: string, spielerId: string): Promise<AxiosResponse<Ergebnis[]>> => {
    return await axiosClient.get<Ergebnis[]>(`${ENDPOINT}?aufgabe_id=${aufgabeId}&spieler_id=${spielerId}`);
};

export const getErgebnisBySpielerIdApi = async (spielerId: string): Promise<AxiosResponse<Ergebnis[]>> => {
    return await axiosClient.get<Ergebnis[]>(`${ENDPOINT}?spieler_id=${spielerId}`);
};

export const getErgebnisBySemesterIdApi = async (id: string): Promise<AxiosResponse<Ergebnis[]>> => {
    return await axiosClient.get<Ergebnis[]>(`${ENDPOINT}/semester/${id}`);
};

export const createErgebnisApi = async (ergebnisDto: ErgebnisDto) => {
    const payload = JSON.stringify(ergebnisDto);
    return await axiosClient.post(ENDPOINT, payload);
};
