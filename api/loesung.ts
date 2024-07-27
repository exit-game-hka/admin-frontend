import {axiosClient} from "@/api/httpClient";

export type Loesung = {
    id: string;
    wert: string;
    aufgabeId: string;
};

export const updateLoesungApi = async (loesung: Loesung): Promise<void> => {
    const payload = JSON.stringify(loesung);
    await axiosClient.put("/loesungen", payload);
}