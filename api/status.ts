import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Status = {
    id: string;
    spielerId: string;
    semesterId: string;
    veranstaltungId: string;
    spielStart: Date;
    spielEnde: Date;
    istSpielBeendet: boolean;
};

export type StatusDto = Omit<Status, "id">;

const ENDPOINT = "/status" as const;

export const getStatusBySpielerIdApi = async (id: string): Promise<AxiosResponse<Status>> => {
    return await axiosClient.get<Status>(`${ENDPOINT}/spieler/${id}`);
};

export const getStatusBySemesterIdApi = async (id: string): Promise<AxiosResponse<Status>> => {
    return await axiosClient.get<Status>(`${ENDPOINT}/semester/${id}`);
};

export const createStatusApi = async (statusDto: StatusDto) => {
    const payload = JSON.stringify(statusDto);
    return await axiosClient.post(ENDPOINT, payload);
}

export const updateStatusApi = async (status: Status) => {
    const payload = JSON.stringify(status);
    return await axiosClient.put(ENDPOINT, payload);
};
