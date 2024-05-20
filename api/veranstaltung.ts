import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Veranstaltung = {
    id: string;
    name: string;
    bezeichnung: string;
    beschreibung: string;
};

export type VeranstaltungDto = Omit<Veranstaltung, "id">;

const ENDPOINT = "/veranstaltung" as const;

export const getVeranstaltungByIdApi = async (id: string): Promise<AxiosResponse<Veranstaltung>> => {
    return await axiosClient.get<Veranstaltung>(ENDPOINT);
};

export const getAllVeranstaltungenApi = async (): Promise<AxiosResponse<Veranstaltung[]>> => {
    return await axiosClient.get<Veranstaltung[]>(`${ENDPOINT}/alle`);
};

export const createVeranstaltungApi = async (veranstaltungDto: VeranstaltungDto) => {
    const payload = JSON.stringify(veranstaltungDto);
    return await axiosClient.post(ENDPOINT, payload);
};

export const updateVeranstaltungApi = async (veranstaltung: Veranstaltung) => {
    const payload = JSON.stringify(veranstaltung);
    return await axiosClient.put(`${ENDPOINT}/${veranstaltung.id}`, payload);
};
