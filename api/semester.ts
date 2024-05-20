import {AxiosResponse} from "axios";
import {axiosClient} from "@/api/httpClient";

export type Semester = {
    id: string;
    start: Date;
    ende: Date;
    bezeichnung: string;
};

export type SemesterDto = Omit<Semester, "id">;

const ENDPOINT = "/semester" as const;

export const getSemesterByIdApi = async (id: string): Promise<AxiosResponse<Semester>> => {
    return await axiosClient.get<Semester>(`${ENDPOINT}/${id}`);
};

export const getAllSemesterApi = async (): Promise<AxiosResponse<Semester[]>> => {
    return await axiosClient.get<Semester[]>(`${ENDPOINT}/alle`);
};

export const createSemesterApi = async (semesterDto: SemesterDto) => {
    const payload = JSON.stringify(semesterDto);
    return await axiosClient.post(ENDPOINT, payload);
};

export const updateSemesterApi = async (semester: Semester) => {
    const payload = JSON.stringify(semester);
    return await axiosClient.put(ENDPOINT, payload);
};

export const deleteSemesterApi = async (id: string) => {
    return await axiosClient.delete(`${ENDPOINT}/${id}`);
};
