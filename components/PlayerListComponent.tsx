"use client";
import React from 'react';
import {Alert, Box, Table} from "@mui/joy";
import useSWR from "swr";
import useApplicationContext from "@/hooks/useApplicationContext";
import {Spieler} from "@/api/spieler";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Semester} from "@/api/semester";
import {Veranstaltung} from "@/api/veranstaltung";

const PlayerListComponent: React.FC = () => {
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

    if (isLoadingSpieler || !spieler) return <div>Wird geladen...</div>

    if (errorSpieler) return <Alert color="danger">{(errorSpieler as Error).message}</Alert>

    return (
        <Table size="lg" variant="outlined" sx={{ borderRadius: "lg" }}>
            <Box component="thead">
                <Box
                    component="tr"
                    sx={{
                        fontWeight: 600,
                        "& td": {
                            borderBottom: "2px solid var(--TableCell-borderColor)",
                            py: isSmall ? "10px" : "15px",
                        },
                    }}
                >
                    <Box component="td" sx={{ width: "50px" }}></Box>
                    <Box component="td">Spieler-ID</Box>
                    <Box component="td">Semester</Box>
                    {isSmall ?
                        null :
                        <>
                            <Box component="td">Veranstaltung</Box>
                        </>
                    }
                </Box>
            </Box>
            <Box component="tbody">
                {spieler.map((spieler, index) =>
                    <Box
                        component="tr"
                        key={index}
                        sx={{
                            "&:hover": {
                                "& *": {
                                    backgroundColor: theme => theme.vars.palette.primary[500],
                                    color: "white",
                                    cursor: "pointer",
                                },
                            }
                        }}
                    >
                        <Box component="td" sx={{ width: "50px" }}>
                            <AccountCircleOutlinedIcon />
                        </Box>
                        <Box component="td">{spieler.avatarName}</Box>
                        <Box component="td">{getSemester(spieler.semesterId).bezeichnung}</Box>
                        {isSmall ?
                            null :
                            <>
                                <Box component="td">
                                    {getVeranstaltung(spieler.veranstaltungId).bezeichnung} - {getVeranstaltung(spieler.veranstaltungId).name}
                                </Box>
                            </>
                        }
                    </Box>
                )}
            </Box>
        </Table>
    );
};

export default PlayerListComponent;

