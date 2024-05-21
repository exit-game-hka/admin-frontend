"use client";
import React from 'react';
import {Alert, Box} from "@mui/joy";
import styled from "styled-components";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {StatsCardComponent} from "@/components/shared/StatsCardComponent";
import {Status} from "@/api/status";

export const StatusListComponent: React.FC = () => {
    const { semester, getStatusBySemesterId } = useApplicationContext();

    const {
        data: statusList,
        isLoading,
        error,
    } = useSWR<Status[]>("getStatusBySemesterId", async () => await getStatusBySemesterId(semester?.id!));

    if (!semester) return <Alert color="warning">Wählen Sie erst ein Semester aus </Alert>

    if (isLoading || !statusList) return <Alert color="warning">Wird geladen...</Alert>

    if (error) return <Alert color="danger">Fehler beim Laden der Daten</Alert>

    return (
        <StatusListContainer>
            <StatsCardComponent
                label={"Angefangene Spiele"}
                value={statusList.filter((s) => !s.istSpielBeendet).length}
            />
            <StatsCardComponent
                label={"Erfolgreich beendete Spiele"}
                value={statusList.filter((s) => s.istSpielBeendet).length}
            />
            <StatsCardComponent
                label={"Abgebrochene Spiele"}
                value={statusList.filter((s) => s.istSpielAbgebrochen).length}
            />
            <StatsCardComponent
                label={"Durchschnittliche Spieldauer"}
                value={1000}
            />
        </StatusListContainer>
    );
};

const StatusListContainer = styled(Box)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: var(--gap-3);
    
    @media screen and (max-width: 900px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
`;

