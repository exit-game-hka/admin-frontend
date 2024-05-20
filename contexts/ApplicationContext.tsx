"use client";
import React, {createContext, PropsWithChildren} from "react";
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

type ContextOutput = {
    getInteraktionBySpielerIdAndAufgabeId: (spielerId: string, aufgabeId: string) => Promise<Interaktion[]>;
    createInteraktion: (interaktionDto: InteraktionDto) => Promise<void>;
    getSemesterById: (id: string) => Promise<Semester>;
    getAllSemester: () => Promise<Semester[]>;
    createSemester: (semesterDto: SemesterDto) => Promise<void>;
    updateSemester: (semester: Semester) => Promise<void>;
    deleteSemester: (id: string) => Promise<void>;
    getSpielerById: (id: string) => Promise<Spieler>;
    getSpielerBySpielerId: (spielerId: string) => Promise<Spieler>;
    getAllSpieler: () => Promise<Spieler[]>;
    createSpieler: (spielerDto: SpielerDto) => Promise<void>;
    updateSpieler: (spieler: Spieler) => Promise<void>;
    getStatusBySpielerId: (id: string) => Promise<Status>;
    getStatusBySemesterId: (id: string) => Promise<Status>;
    //createStatus: (statusDto: StatusDto) => Promise<void>;
    //updateStatus: (status: Status) => Promise<void>;
    getVeranstaltungById: (id: string) => Promise<Veranstaltung>;
    getAllVeranstaltungen: () => Promise<Veranstaltung[]>;
    createVeranstaltung: (veranstaltungDto: VeranstaltungDto) => Promise<void>;
    updateVeranstaltung: (veranstaltung: Veranstaltung) => Promise<void>;
}

// @ts-ignore
export const ApplicationContext = createContext<ContextOutput>({});

type Props = Readonly<PropsWithChildren>;

export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;

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

    const getStatusBySpielerId = async (id: string): Promise<Status> => {
        const response = await getStatusBySpielerIdApi(id);
        return response.data;
    }

    const getStatusBySemesterId = async (id: string): Promise<Status> => {
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

    return (
        <ApplicationContext.Provider value={{
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
            getStatusBySpielerId,
            getStatusBySemesterId,
            //createStatus,
            //updateStatus,
            getVeranstaltungById,
            getAllVeranstaltungen,
            createVeranstaltung,
            updateVeranstaltung,
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
// Types
// ----------------------------------------------------------------