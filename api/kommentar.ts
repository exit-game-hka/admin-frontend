import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Kommentar = {
    id: string;
    spielerId: string;
    semesterId: string;
    inhalt: string;
};

export type KommentarDto = Omit<Kommentar, "id">;

const ENDPOINT = "/kommentare" as const;

export const getKommentarByIdApi = async (id: string): Promise<AxiosResponse<Kommentar>> => {
    return await axiosClient.get<Kommentar>(`${ENDPOINT}/${id}`);
};

export const getKommentareBySemesterIdApi = async (semesterId: string): Promise<AxiosResponse<Kommentar[]>> => {
    return await axiosClient.get<Kommentar[]>(`${ENDPOINT}?semester_id=${semesterId}`);
};

export const getKommentareByStudentIdApi = async (studentId: string): Promise<AxiosResponse<Kommentar[]>> => {
    return await axiosClient.get<Kommentar[]>(`${ENDPOINT}?student_id=${studentId}`);
};

export const getKommentareBySpielerIdAndSemesterIdApi = async (studentId: string, semesterId: string): Promise<AxiosResponse<Kommentar[]>> => {
    return await axiosClient.get<Kommentar[]>(`${ENDPOINT}?student_id=${studentId}&semester_id=${semesterId}`);
};

export const createKommentarApi = async (kommentarDto: KommentarDto) => {
    const payload = JSON.stringify(kommentarDto);
    return await axiosClient.post(ENDPOINT, payload);
};