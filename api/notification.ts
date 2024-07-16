import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Notification = {
    id: string;
    userName: string;
    title: string;
    content: string;
    creationDate: string;
    viewed: boolean;
    type: string;
};

const ENDPOINT = "/notifications/rest" as const;

export const getAllNotificationApi = async (): Promise<AxiosResponse<Notification[]>> => {
    return await axiosClient.get<Notification[]>(`${ENDPOINT}`);
};

export const deleteNotificationByIdApi = async (id: string): Promise<AxiosResponse<void>> => {
    return await axiosClient.delete(`${ENDPOINT}/${id}`);
};

export const deleteAllNotificationsApi = async (): Promise<AxiosResponse<void>> => {
    return await axiosClient.delete(`${ENDPOINT}/all`);
};

export const setAllNotificationAsSeenApi = async (): Promise<void> => {
    return await axiosClient.post(`${ENDPOINT}/set-all-seen`);
};
