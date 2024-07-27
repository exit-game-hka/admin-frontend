import {Loesung} from "@/api/loesung";
import {Gegenstand} from "@/api/gegenstand";
import {axiosClient} from "@/api/httpClient";

export type Aufgabe = {
    id: string;
    raumId: string;
    wert: string;
    zeitZuLoesen: number;
    beschreibung: string;
    erfolgMeldung: string;
    fehlschlagMeldung: string;
    loesungen: Loesung[];
    gegenstaende: Gegenstand[];
};

export const updateAufgabeApi = async (aufgabe: Aufgabe): Promise<void> => {
    const payload = JSON.stringify(aufgabe);
    await axiosClient.put("/aufgaben", payload);
};
