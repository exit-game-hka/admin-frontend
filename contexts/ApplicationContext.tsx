"use client";
import React, {createContext, PropsWithChildren, useState} from "react";
import {
    createInteraktionApi,
    getInteraktionBySpielerIdAndAufgabeIdApi,
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
    SpielerDto,
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
import {Ergebnis, getErgebnisByAufgabeIdAndSpielerIdApi, getErgebnisBySemesterIdApi} from "@/api/ergebnis";
import {AxiosResponse} from "axios";
import {
    getKommentarByIdApi,
    getKommentareBySemesterIdApi, getKommentareBySpielerIdAndSemesterIdApi,
    getKommentareByStudentIdApi,
    Kommentar
} from "@/api/kommentar";

type ContextOutput = {
    semester: Semester | undefined;
    setSemester: (semester: Semester) => void;
    getInteraktionBySpielerIdAndAufgabeId: (spielerId: string, aufgabeId: string) => Promise<Interaktion[]>;
    createInteraktion: (interaktionDto: InteraktionDto) => Promise<void>;
    getSemesterById: (id: string) => Promise<Semester>;
    getAllSemester: () => Promise<Semester[]>;
    createSemester: (semesterDto: SemesterDto) => Promise<void>;
    updateSemester: (semester: Semester) => Promise<void>;
    deleteSemester: (id: string) => Promise<void>;
    // Spieler
    getSpielerById: (id: string) => Promise<Spieler>;
    getSpielerBySpielerId: (spielerId: string) => Promise<Spieler>;
    getAllSpieler: () => Promise<Spieler[]>;
    createSpieler: (spielerDto: SpielerDto) => Promise<void>;
    updateSpieler: (spieler: Spieler) => Promise<void>;
    getSpielerListBySemesterId: (semesterId: string) => Promise<Spieler[]>;
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
    //createErgebnis: (ergebnisDto: ErgebnisDto) => Promise<void>;
    // Kommentare
    getKommentarById: (id: string) => Promise<Kommentar>;
    getKommentareBySemesterId: (semesterId: string) => Promise<Kommentar[]>;
    getKommentareByStudentId: (studentId: string) => Promise<Kommentar[]>;
    getKommentareBySpielerIdAndSemesterId: (studentId: string, semesterId: string) => Promise<Kommentar[]>;

}

// @ts-ignore
export const ApplicationContext = createContext<ContextOutput>({});

type Props = Readonly<PropsWithChildren>;

export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;

    const [semester, setSemester] = useState<Semester | undefined>(undefined);

    const getInteraktionBySpielerIdAndAufgabeId = async (spielerId: string, aufgabeId: string): Promise<Interaktion[]> => {
        const response = await getInteraktionBySpielerIdAndAufgabeIdApi(spielerId, aufgabeId);
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

    const getAllSpieler = async (): Promise<Spieler[]> => {
        const response = await getAllSpielerApi();
        return response.data;
    }

    const createSpieler = async (spielerDto: SpielerDto): Promise<void> => {
        await createSpielerApi(spielerDto);
    }

    const updateSpieler = async (spieler: Spieler): Promise<void> => {
        await updateSpielerApi(spieler);
    }

    const getSpielerListBySemesterId = async (semesterId: string): Promise<Spieler[]> => {
        const response = await getSpielerListBySemesterIdApi(semesterId);
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

    // const createErgebnis = async (ergebnisDto: ErgebnisDto): Promise<void> => {
    //     await createErgebnisApi(ergebnisDto);
    // }

    const getKommentarById = async (id: string): Promise<Kommentar> => {
        const response = await getKommentarByIdApi(id);
        return response.data;
    };

    const getKommentareBySemesterId = async (semesterId: string): Promise<Kommentar[]> => {
        const response = await getKommentareBySemesterIdApi(semesterId);
        return response.data;
    };

    const getKommentareByStudentId = async (studentId: string): Promise<Kommentar[]> => {
        const response = await getKommentareByStudentIdApi(studentId);
        return response.data;
    };

    const getKommentareBySpielerIdAndSemesterId = async (studentId: string, semesterId: string): Promise<Kommentar[]> => {
        const response = await getKommentareBySpielerIdAndSemesterIdApi(studentId, semesterId);
        return response.data;
    };

    return (
        <ApplicationContext.Provider value={{
            semester,
            setSemester,
            getInteraktionBySpielerIdAndAufgabeId,
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
            //createErgebnis,
            getKommentarById,
            getKommentareBySemesterId,
            getKommentareByStudentId,
            getKommentareBySpielerIdAndSemesterId,
        }}>
            {children}
        </ApplicationContext.Provider>
    )
};

const convertToSemesterModel = (semester: Semester): Semester => {
    return {
        ...semester,
        start: new Date(semester.start),
        ende: new Date(semester.ende),
    };
}
// ----------------------------------------------------------------
// Types & const
// ----------------------------------------------------------------

export const TIME_UNIT: string = "Min." as const;

export enum Aufgabe {
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
    playerId: string;
    interactionPerRoom: Rooms;
    timeSpentPerRoom: Rooms;
    totalPlayTime: string;
    triesPerTask: Rooms;
    hasFinishedGame: string;
    comments: string[];
};