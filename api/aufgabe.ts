import {Loesung} from "@/api/loesung";
import {Gegenstand} from "@/api/gegenstand";

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
