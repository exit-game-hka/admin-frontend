import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Spieler = {
    id: string;
    avatarName: string;
    semesterId: string;
    veranstaltungId: string;
};

export type SpielerDto = Omit<Spieler, "id">;

const ENDPOINT = "/spieler" as const;

export const getSpielerByIdApi = async (id: string): Promise<AxiosResponse<Spieler>> => {
    return await axiosClient.get<Spieler>(`${ENDPOINT}/${id}`);
};

export const getSpielerByAvatarNameApi = async (avatarName: string): Promise<AxiosResponse<Spieler>> => {
    return await axiosClient.get<Spieler>(`${ENDPOINT}?avatar_name=${avatarName}`);
}

export const getAllSpielerApi = async (): Promise<AxiosResponse<Spieler[]>> => {
    return await axiosClient.get<Spieler[]>(`${ENDPOINT}/alle`);
};

export const createSpielerApi = async (spielerDto: SpielerDto) => {
    const payload = JSON.stringify(spielerDto);
    return await axiosClient.post(`${ENDPOINT}`, payload);
};

export const updateSpielerApi = async (spieler: Spieler) => {
    const payload = JSON.stringify(spieler);
    return await axiosClient.put(ENDPOINT, payload);
};
