import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Spieler = {
    id: string;
    spielerId: string;
    semesterId: string;
    veranstaltungId: string;
};

export type SpielerListPage = {
    pageContent: Spieler[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
};

export type SpielerDto = Omit<Spieler, "id">;

const ENDPOINT = "/spieler" as const;

export const getSpielerByIdApi = async (id: string): Promise<AxiosResponse<Spieler>> => {
    return await axiosClient.get<Spieler>(`${ENDPOINT}/${id}`);
};

export const getSpielerListBySemesterIdApi = async (
    semesterId: string,
    pageNumber?: number,
    pageSize?: number,
): Promise<AxiosResponse<SpielerListPage>> => {
    return await axiosClient.get<SpielerListPage>(
        `${ENDPOINT}/alle?semester_id=${semesterId}&page_number=${pageNumber}&page_size=${pageSize}`
    );
};

export const getSpielerBySpielerIdApi = async (avatarName: string): Promise<AxiosResponse<Spieler>> => {
    return await axiosClient.get<Spieler>(`${ENDPOINT}?spieler_id=${avatarName}`);
}

export const getAllSpielerApi = async (pageNumber?: number, pageSize?: number): Promise<AxiosResponse<SpielerListPage>> => {
    return await axiosClient.get<SpielerListPage>(`${ENDPOINT}/alle?page_number=${pageNumber}&page_size=${pageSize}`);
};

export const createSpielerApi = async (spielerDto: SpielerDto) => {
    const payload = JSON.stringify(spielerDto);
    return await axiosClient.post(`${ENDPOINT}`, payload);
};

export const updateSpielerApi = async (spieler: Spieler) => {
    const payload = JSON.stringify(spieler);
    return await axiosClient.put(ENDPOINT, payload);
};
