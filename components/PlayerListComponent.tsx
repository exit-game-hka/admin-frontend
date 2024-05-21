"use client";
import React from 'react';
import {Alert, Box, TableProps} from "@mui/joy";
import useSWR from "swr";
import useApplicationContext from "@/hooks/useApplicationContext";
import {Spieler} from "@/api/spieler";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Semester} from "@/api/semester";
import {Veranstaltung} from "@/api/veranstaltung";
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";

type Props = {
    tableProps: TableProps;
    limit?: number | undefined;
};

const PlayerListComponent: React.FC<Props> = (props) => {
    const { tableProps, limit } = props;
    const { getAllSpieler, getAllSemester, getAllVeranstaltungen } = useApplicationContext();
    const { isSmall } = useMediaQuery();

    const {
        data: spieler,
        isLoading: isLoadingSpieler,
        error: errorSpieler,
    } = useSWR<Spieler[]>("getAllPlayer", async () => await getAllSpieler());

    const {
        data: semesters,
        isLoading: isLoadingSemesters,
        error: errorSemesters,
    } = useSWR<Semester[]>("getAllSemester", async () => await getAllSemester());

    const {
        data: veranstaltungen,
        isLoading: isLoadingVeranstaltungen,
        error: errorVeranstaltungen,
    } = useSWR<Veranstaltung[]>("getAllVeranstaltungen", async () => await getAllVeranstaltungen());

    const getSemester = (id: string): Semester => {
        return semesters?.find(s => s.id === id) as Semester;
    }

    const getVeranstaltung = (id: string): Veranstaltung => {
        return veranstaltungen?.find(s => s.id === id) as Veranstaltung;
    }

    if (
        isLoadingSpieler ||
        isLoadingSemesters ||
        isLoadingVeranstaltungen ||
        !spieler ||
        !semesters ||
        !veranstaltungen
    ) return <div>Wird geladen...</div>

    if (errorSpieler) return <Alert color="danger">{(errorSpieler as Error).message}</Alert>

    if (errorSemesters) return <Alert color="danger">{(errorSemesters as Error).message}</Alert>

    if (errorVeranstaltungen) return <Alert color="danger">{(errorVeranstaltungen as Error).message}</Alert>

    return (
        <CustomTableComponent
            {...tableProps}
            headerCells={
                <>
                    <Box component="td" sx={{ width: "50px" }}></Box>
                    <Box component="td">Spieler-ID</Box>
                    <Box component="td">Semester</Box>
                    {isSmall ?
                        null :
                        <Box component="td">Veranstaltung</Box>
                    }
                </>
            }
            bodyRows={spieler.slice(0, limit).map((spieler) =>
                <>
                    <Box component="td" sx={{ width: "50px" }}>
                        <AccountCircleOutlinedIcon />
                    </Box>
                    <Box component="td">{spieler.spielerId}</Box>
                    <Box component="td">{getSemester(spieler.semesterId).bezeichnung}</Box>
                    {isSmall ?
                        null :
                        <Box component="td">
                            {getVeranstaltung(spieler.veranstaltungId).bezeichnung} - {getVeranstaltung(spieler.veranstaltungId).name}
                        </Box>
                    }
                </>
            )}
        />
    );
};

export default PlayerListComponent;
