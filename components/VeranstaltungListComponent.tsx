"use client";
import React from 'react';
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Alert, Box, Typography} from "@mui/joy";
import {Veranstaltung} from "@/api/veranstaltung";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';

export const VeranstaltungListComponent: React.FC = () => {
    const { isSmall } = useMediaQuery();
    const { getAllVeranstaltungen } = useApplicationContext();
    const {
        data: veranstaltungen,
        isLoading,
        error,
    } = useSWR<Veranstaltung[]>("getAllVeranstaltungen", async () => await getAllVeranstaltungen());

    if (isLoading || !veranstaltungen) return <div>Wird geladen...</div>

    if (error) return <Alert color="danger">{(error as Error).message}</Alert>

    return (
        <CustomTableComponent
            headerCells={
                <Box component="tr">
                    <Box component="th" sx={{ width: "50px" }}></Box>
                    <Box component="th">Name</Box>
                    {isSmall ?
                        null :
                        <>
                            <Box component="th">Bezeichnung(Abkürzung)</Box>
                            <Box component="th">Beschreibung</Box>
                        </>
                    }
                </Box>
            }
            bodyRows={veranstaltungen.map((v) => ({
                    content: (
                        <React.Fragment key={v.id}>
                            <Box component="td" sx={{ width: "50px" }}>
                                <SportsEsportsOutlinedIcon />
                            </Box>
                            <Box component="td">{v.name}</Box>
                            {isSmall ?
                                null :
                                <>
                                    <Box component="td">{v.bezeichnung}</Box>
                                    <Box component="td">
                                        <Typography noWrap>{v.beschreibung}</Typography>
                                    </Box>
                                </>
                            }
                        </React.Fragment>
                    )
                })
            )}
        />
    );
};

