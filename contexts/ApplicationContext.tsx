"use client";
import React, {createContext, PropsWithChildren, useEffect, useState} from "react";
import {
    createInteraktionApi,
    getInteraktionBySpielerIdAndAufgabeIdApi,
    getInteraktionBySpielerIdApi,
    Interaktion,
    InteraktionDto
} from "@/api/interaktion";
import {
    createSemesterApi,
    deleteSemesterApi,
    getAllSemesterApi,
    getSemesterByIdApi,
    Semester,
    SemesterDto,
    updateSemesterApi
} from "@/api/semester";
import {
    createSpielerApi,
    getAllSpielerApi,
    getSpielerByIdApi,
    getSpielerBySpielerIdApi,
    getSpielerListBySemesterIdApi,
    Spieler,
    SpielerDto, SpielerListPage,
    updateSpielerApi
} from "@/api/spieler";
import {getStatusBySemesterIdApi, getStatusBySpielerIdApi, Status} from "@/api/status";
import {
    createVeranstaltungApi,
    getAllVeranstaltungenApi,
    getVeranstaltungByIdApi,
    updateVeranstaltungApi,
    Veranstaltung,
    VeranstaltungDto
} from "@/api/veranstaltung";
import {
    Ergebnis,
    getErgebnisByAufgabeIdAndSpielerIdApi,
    getErgebnisBySemesterIdApi,
    getErgebnisBySpielerIdApi
} from "@/api/ergebnis";
import {
    getKommentarByIdApi,
    getKommentareBySemesterIdApi,
    getKommentareBySpielerIdAndSemesterIdApi,
    getKommentareBySpielerIdApi,
    Kommentar
} from "@/api/kommentar";
import exportFromJSON from "export-from-json";

type ContextOutput = {
    semester: Semester | undefined;
    setSemester: (semester: Semester) => void;
    // Interaktionen
    getInteraktionBySpielerIdAndAufgabeId: (spielerId: string, aufgabeId: string) => Promise<Interaktion[]>;
    getInteraktionBySpielerId: (spielerId: string) => Promise<Interaktion[]>;
    createInteraktion: (interaktionDto: InteraktionDto) => Promise<void>;
    // Semester
    getSemesterById: (id: string) => Promise<Semester>;
    getAllSemester: () => Promise<Semester[]>;
    createSemester: (semesterDto: SemesterDto) => Promise<void>;
    updateSemester: (semester: Semester) => Promise<void>;
    deleteSemester: (id: string) => Promise<void>;
    // Spieler
    getSpielerById: (id: string) => Promise<Spieler>;
    getSpielerBySpielerId: (spielerId: string) => Promise<Spieler>;
    getAllSpieler: (pageNumber?: number, pageSize?: number) => Promise<SpielerListPage>;
    createSpieler: (spielerDto: SpielerDto) => Promise<void>;
    updateSpieler: (spieler: Spieler) => Promise<void>;
    getSpielerListBySemesterId: (semesterId: string, pageNumber?: number, pageSize?: number) => Promise<SpielerListPage>;
    // Status
    getStatusBySpielerId: (id: string) => Promise<Status>;
    getStatusBySemesterId: (id: string) => Promise<Status[]>;
    //createStatus: (statusDto: StatusDto) => Promise<void>;
    //updateStatus: (status: Status) => Promise<void>;
    getVeranstaltungById: (id: string) => Promise<Veranstaltung>;
    getAllVeranstaltungen: () => Promise<Veranstaltung[]>;
    createVeranstaltung: (veranstaltungDto: VeranstaltungDto) => Promise<void>;
    updateVeranstaltung: (veranstaltung: Veranstaltung) => Promise<void>;
    // Ergebnis
    getErgebnisByAufgabeIdAndSpielerId: (aufgabeId: string, spielerId: string) => Promise<Ergebnis[]>;
    getErgebnisBySemesterId: (id: string) => Promise<Ergebnis[]>;
    getErgebnisBySpielerId: (spielerId: string) => Promise<Ergebnis[]>;
    //createErgebnis: (ergebnisDto: ErgebnisDto) => Promise<void>;
    // Kommentare
    getKommentarById: (id: string) => Promise<Kommentar>;
    getKommentareBySemesterId: (semesterId: string) => Promise<Kommentar[]>;
    getKommentareBySpielerId: (spielerId: string) => Promise<Kommentar[]>;
    getKommentareBySpielerIdAndSemesterId: (spielerId: string, semesterId: string) => Promise<Kommentar[]>;
    // Time unit
    timeUnit: TimeUnit;
    setTimeUnit: (timeUnit: TimeUnit) => void;
    numberDecimalPlace: NumberDecimalPlace;
    setNumberDecimalPlace: (numberDecimalPlace: NumberDecimalPlace) => void;
}

// @ts-ignore
export const ApplicationContext = createContext<ContextOutput>({});

type Props = Readonly<PropsWithChildren>;

export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;

    const [semester, setSemester] = useState<Semester | undefined>(undefined);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>("Minuten");
    const [numberDecimalPlace, setNumberDecimalPlace] = useState<NumberDecimalPlace>(0);

    useEffect(() => {
        const getTimeUnitFromLocalStorage = () => {
            const timeUnitFromLocalStorage = localStorage.getItem("time-unit");
            if (!timeUnitFromLocalStorage || timeUnitFromLocalStorage !== "Minuten" && timeUnitFromLocalStorage !== "Stunden") return;
            setTimeUnit(timeUnitFromLocalStorage);
        }

        const getNumberDecimalPlaceFromLocalStorage = () => {
            const numberDecimalPlaceFromLocalStorage = localStorage.getItem("number-decimal-place");
            if (!numberDecimalPlaceFromLocalStorage || numberDecimalPlaceFromLocalStorage!== "0" && numberDecimalPlaceFromLocalStorage!== "1" && numberDecimalPlaceFromLocalStorage!== "2") return;
            setNumberDecimalPlace(parseInt(numberDecimalPlaceFromLocalStorage) as NumberDecimalPlace);
        }

        getTimeUnitFromLocalStorage();
        getNumberDecimalPlaceFromLocalStorage();
    }, []);

    const setTimeUnitHandler = (timeUnit: TimeUnit) => {
        localStorage.setItem("time-unit", timeUnit);
        setTimeUnit(timeUnit);
    }

    const setNumberDecimalPlaceHandler = (numberDecimalPlace: NumberDecimalPlace) => {
        localStorage.setItem("number-decimal-place", numberDecimalPlace.toString());
        setNumberDecimalPlace(numberDecimalPlace);
    }

    const getInteraktionBySpielerIdAndAufgabeId = async (spielerId: string, aufgabeId: string): Promise<Interaktion[]> => {
        const response = await getInteraktionBySpielerIdAndAufgabeIdApi(spielerId, aufgabeId);
        return response.data;
    }

    const getInteraktionBySpielerId = async (spielerId: string): Promise<Interaktion[]> => {
        const response = await getInteraktionBySpielerIdApi(spielerId);
        return response.data;
    }

    const createInteraktion = async (interaktionDto: InteraktionDto): Promise<void> => {
        await createInteraktionApi(interaktionDto);
    }

    const getSemesterById = async (id: string): Promise<Semester> => {
        const response = await getSemesterByIdApi(id);
        return convertToSemesterModel(response.data);
    }

    const getAllSemester = async (): Promise<Semester[]> => {
        const response = await getAllSemesterApi();
        return response.data.map((d) => convertToSemesterModel(d));
    }

    const createSemester = async (semesterDto: SemesterDto): Promise<void> => {
        await createSemesterApi(semesterDto);
    }

    const updateSemester = async (semester: Semester): Promise<void> => {
        await updateSemesterApi(semester);
    }

    const deleteSemester = async (id: string): Promise<void> => {
        await deleteSemesterApi(id);
    }

    const getSpielerById = async (id: string): Promise<Spieler> => {
        const response = await getSpielerByIdApi(id);
        return response.data;
    }

    const getSpielerBySpielerId = async (spielerId: string): Promise<Spieler> => {
        const response = await getSpielerBySpielerIdApi(spielerId);
        return response.data;
    }

    const getAllSpieler = async (pageNumber?: number, pageSize?: number): Promise<SpielerListPage> => {
        const response = await getAllSpielerApi(pageNumber, pageSize);
        return response.data;
    }

    const createSpieler = async (spielerDto: SpielerDto): Promise<void> => {
        await createSpielerApi(spielerDto);
    }

    const updateSpieler = async (spieler: Spieler): Promise<void> => {
        await updateSpielerApi(spieler);
    }

    const getSpielerListBySemesterId = async (semesterId: string, pageNumber?: number, pageSize?: number): Promise<SpielerListPage> => {
        const response = await getSpielerListBySemesterIdApi(semesterId, pageNumber, pageSize);
        return response.data;
    }

    const getStatusBySpielerId = async (id: string): Promise<Status> => {
        const response = await getStatusBySpielerIdApi(id);
        return response.data;
    }

    const getStatusBySemesterId = async (id: string): Promise<Status[]> => {
        const response = await getStatusBySemesterIdApi(id);
        return response.data;
    }

    // const createStatus = async (statusDto: StatusDto): Promise<void> => {
    //     const response = await createStatusApi(statusDto);
    //     return response.data;
    // }
    //
    // const updateStatus = async (status: Status): Promise<void> => {
    //     await updateStatusApi(status);
    // }

    const getVeranstaltungById = async (id: string): Promise<Veranstaltung> => {
        const response = await getVeranstaltungByIdApi(id);
        return response.data;
    }

    const getAllVeranstaltungen = async (): Promise<Veranstaltung[]> => {
        const response = await getAllVeranstaltungenApi();
        return response.data;
    }

    const createVeranstaltung = async (veranstaltungDto: VeranstaltungDto): Promise<void> => {
        await createVeranstaltungApi(veranstaltungDto);
    }

    const updateVeranstaltung = async (veranstaltung: Veranstaltung): Promise<void> => {
        await updateVeranstaltungApi(veranstaltung);
    }

    // Ergebnis
    const getErgebnisByAufgabeIdAndSpielerId = async (aufgabeId: string, spielerId: string): Promise<Ergebnis[]> => {
        const response = await getErgebnisByAufgabeIdAndSpielerIdApi(aufgabeId, spielerId);
        return response.data;
    }

    const getErgebnisBySemesterId = async (id: string): Promise<Ergebnis[]> => {
        const response = await getErgebnisBySemesterIdApi(id);
        return response.data;
    }

    const getErgebnisBySpielerId = async (spielerId: string): Promise<Ergebnis[]> => {
        const response = await getErgebnisBySpielerIdApi(spielerId);
        return response.data;
    }

    // const createErgebnis = async (ergebnisDto: ErgebnisDto): Promise<void> => {
    //     await createErgebnisApi(ergebnisDto);
    // }

    const getKommentarById = async (id: string): Promise<Kommentar> => {
        const response = await getKommentarByIdApi(id);
        return convertToKommentarModel(response.data);
    };

    const getKommentareBySemesterId = async (semesterId: string): Promise<Kommentar[]> => {
        const response = await getKommentareBySemesterIdApi(semesterId);
        return response.data.map((k) => convertToKommentarModel(k));
    };

    const getKommentareBySpielerId = async (spielerId: string): Promise<Kommentar[]> => {
        const response = await getKommentareBySpielerIdApi(spielerId);
        return response.data.map((k) => convertToKommentarModel(k));
    };

    const getKommentareBySpielerIdAndSemesterId = async (spielerId: string, semesterId: string): Promise<Kommentar[]> => {
        const response = await getKommentareBySpielerIdAndSemesterIdApi(spielerId, semesterId);
        return response.data.map((k) => convertToKommentarModel(k));
    };

    return (
        <ApplicationContext.Provider value={{
            semester,
            setSemester,
            getInteraktionBySpielerIdAndAufgabeId,
            getInteraktionBySpielerId,
            createInteraktion,
            getSemesterById,
            getAllSemester,
            createSemester,
            updateSemester,
            deleteSemester,
            getSpielerById,
            getSpielerBySpielerId,
            getAllSpieler,
            createSpieler,
            updateSpieler,
            getSpielerListBySemesterId,
            getStatusBySpielerId,
            getStatusBySemesterId,
            //createStatus,
            //updateStatus,
            getVeranstaltungById,
            getAllVeranstaltungen,
            createVeranstaltung,
            updateVeranstaltung,
            getErgebnisByAufgabeIdAndSpielerId,
            getErgebnisBySemesterId,
            getErgebnisBySpielerId,
            //createErgebnis,
            getKommentarById,
            getKommentareBySemesterId,
            getKommentareBySpielerId,
            getKommentareBySpielerIdAndSemesterId,
            timeUnit,
            setTimeUnit: setTimeUnitHandler,
            numberDecimalPlace,
            setNumberDecimalPlace: setNumberDecimalPlaceHandler,
        }}>
            {children}
        </ApplicationContext.Provider>
    )
};

const transformResultsForExport = (results: CleanResult[]): Record<string, any>[] => {
    return results.map((r) => {
        return {
            "Spieler-ID": r.spielerId,
            "Anzahl Interaktionen im 1.Raum": r.interactionPerRoom.room1,
            "Anzahl Interaktionen im 2.Raum": r.interactionPerRoom.room2,
            "Anzahl Interaktionen im 3.Raum": r.interactionPerRoom.room3,
            "Anzahl Interaktionen im 4.Raum": r.interactionPerRoom.room4,
            "Anzahl Interaktionen im 5.Raum": r.interactionPerRoom.room5,
            "Anzahl Interaktionen im 6.Raum": r.interactionPerRoom.room6,
            "Dauer im 1.Raum": r.timeSpentPerRoom.room1,
            "Dauer im 2.Raum": r.timeSpentPerRoom.room2,
            "Dauer im 3.Raum": r.timeSpentPerRoom.room3,
            "Dauer im 4.Raum": r.timeSpentPerRoom.room4,
            "Dauer im 5.Raum": r.timeSpentPerRoom.room5,
            "Dauer im 6.Raum": r.timeSpentPerRoom.room6,
            "Dauer insgesamt": r.totalPlayTime,
            "Anzahl Versuche im 1.Raum": r.triesPerTask.room1,
            "Anzahl Versuche im 2.Raum": r.triesPerTask.room2,
            "Anzahl Versuche im 3.Raum": r.triesPerTask.room3,
            "Anzahl Versuche im 4.Raum": r.triesPerTask.room4,
            "Anzahl Versuche im 5.Raum": r.triesPerTask.room5,
            "Anzahl Versuche im 6.Raum": r.triesPerTask.room6,
            "Spiel beendet": r.hasFinishedGame,
            "Kommentare des Nutzers": r.comments.join("\n\n"),
        }
    });
}
export const exportResult = (results: CleanResult[], fileName: string, format: keyof typeof exportFromJSON.types) => {
    const transformedResults = transformResultsForExport(results);
    const formattedFileName = `${fileName}-${new Date().toLocaleDateString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"})}`
    exportFromJSON({
        data: transformedResults,
        fileName: formattedFileName,
        exportType: format,
        replacer: (_, v) => v === null || undefined ? "" : v.toString(),
    });
}

const convertToSemesterModel = (semester: Semester): Semester => {
    return {
        ...semester,
        start: new Date(semester.start),
        ende: new Date(semester.ende),
    };
}

const convertToKommentarModel = (kommentar: Kommentar): Kommentar => {
    return {
        ...kommentar,
        creationTimestamp: new Date(kommentar.creationTimestamp),
    };
}
// ----------------------------------------------------------------
// Types & const
// ----------------------------------------------------------------

export const TIME_UNIT: string = "Min." as const;

export type TimeUnit = "Minuten" | "Stunden";

export type NumberDecimalPlace = 0 | 1 | 2;

export const DEFAULT_PAGE_SIZE = 5 as const;
export const DEFAULT_INITIAL_PAGE_NUMBER = 0 as const;

export type Pagination = {
    pageNumber: number;
    pageSize: number;
};

export type PaginationConfig = {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (pageSize: number) => void;
};

export enum AufgabeId {
    AUFGABE_1 = "30000000-0000-0000-0000-000000000001",
    AUFGABE_2 = "30000000-0000-0000-0000-000000000002",
    AUFGABE_3 = "30000000-0000-0000-0000-000000000003",
    AUFGABE_4 = "30000000-0000-0000-0000-000000000004",
    AUFGABE_5 = "30000000-0000-0000-0000-000000000005",
    AUFGABE_6 = "30000000-0000-0000-0000-000000000006",
}

export type Rooms = {
    room1: string;
    room2: string;
    room3: string;
    room4: string;
    room5: string;
    room6: string;
};

export type CleanResult = {
    spielerId: string;
    idOfPlayer: string;
    interactionPerRoom: Rooms;
    timeSpentPerRoom: Rooms;
    totalPlayTime: string;
    triesPerTask: Rooms;
    hasFinishedGame: string;
    comments: string[];
};

export const convertToTimeUnit = (timeInMinutes: number, timeUnit: TimeUnit): number => {
    switch (timeUnit) {
        case "Minuten": return timeInMinutes;
        case "Stunden": return timeInMinutes / 60;
        default: return timeInMinutes;
    }
}

export const getTimeUnitShorthand = (timeUnit: TimeUnit): string => {
    return timeUnit === "Minuten" ? "Min." : "Std.";
}