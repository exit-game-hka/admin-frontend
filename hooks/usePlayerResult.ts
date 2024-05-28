import useApplicationContext from "@/hooks/useApplicationContext";
import {useCallback, useEffect, useState} from "react";
import {Interaktion} from "@/api/interaktion";
import {getSpielerByIdApi, Spieler} from "@/api/spieler";
import {Kommentar} from "@/api/kommentar";
import {Status} from "@/api/status";
import useSWR from "swr";
import {Ergebnis} from "@/api/ergebnis";
import {Semester} from "@/api/semester";
import {Veranstaltung} from "@/api/veranstaltung";

type Output = {
    data: {
        spieler: Spieler;
        status: Status;
        semester: Semester;
        ergebnisList: Ergebnis[];
        veranstaltung: Veranstaltung;
        interactionList: Interaktion[];
        kommentarList: Kommentar[];
    }
    isLoading: boolean;
    error: Error | undefined;
}
export const usePlayerResult = (playerId: string): Output => {
    const {
        getErgebnisBySpielerId,
        getInteraktionBySpielerId,
        getSpielerById,
        getStatusBySpielerId,
        getSemesterById,
        getVeranstaltungById,
        getKommentareBySpielerId,
    } = useApplicationContext();
    const [spieler, setSpieler] = useState<Spieler | undefined>(undefined);
    const [status, setStatus] = useState<Status | undefined>(undefined);
    const [semester, setSemester] = useState<Semester | undefined>(undefined);
    const [veranstaltung, setVeranstaltung] = useState<Veranstaltung | undefined>(undefined);
    const [interactionList, setInteractionList] = useState<Interaktion[] | undefined>(undefined);
    const [kommentarList, setKommentarList] = useState<Kommentar[] | undefined>(undefined);

    const {
        data: ergebnisList,
        isLoading: isLoadingErgebnis,
        error: errorErgebnis,
    } = useSWR<Ergebnis[]>(`getErgebnisBySpielerId`, async () => await getErgebnisBySpielerId(playerId));

    useEffect(() => {
        const loadSpieler = async () => {
            const loadedSpieler = await getSpielerById(playerId);
            setSpieler(loadedSpieler);
        };

        const loadStatus = async () => {
            const loadedStatus = await getStatusBySpielerId(playerId);
            setStatus(loadedStatus);
        };

        const loadInteractions = async () => {
            const loadedInteractions = await getInteraktionBySpielerId(playerId);
            setInteractionList(loadedInteractions);
        };

        const loadKommentare = async () => {
            const loadedKommentare = await getKommentareBySpielerId(playerId);
            console.log("loadedKommentare: ", loadedKommentare);
            setKommentarList(loadedKommentare);
        };

        loadSpieler();
        loadStatus();
        loadInteractions();
        loadKommentare();
    }, [getSpielerById, getStatusBySpielerId, playerId]);

    useEffect(() => {
        const loadSemester = async () => {
            if (!spieler) return;
            const loadedSemester = await getSemesterById(spieler.semesterId);
            setSemester(loadedSemester);
        };

        const loadVeranstaltung = async () => {
            if (!spieler) return;
            const loadedVeranstaltung = await getVeranstaltungById(spieler.veranstaltungId);
            setVeranstaltung(loadedVeranstaltung);
        };
        loadSemester();
        loadVeranstaltung();
    }, [getSemesterById, getVeranstaltungById, spieler]);

    return {
        data: {
            spieler: spieler as Spieler,
            status: status as Status,
            semester: semester as Semester,
            veranstaltung: veranstaltung as Veranstaltung,
            ergebnisList: ergebnisList as Ergebnis[],
            interactionList: interactionList as Interaktion[],
            kommentarList: kommentarList as Kommentar[],
        },
        isLoading: isLoadingErgebnis,
        error: errorErgebnis as Error,
    };
};
