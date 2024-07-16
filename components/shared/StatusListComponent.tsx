"use client";
import React, {useCallback} from 'react';
import {Alert, Box} from "@mui/joy";
import styled from "styled-components";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {StatsCardComponent} from "@/components/shared/StatsCardComponent";
import {Status} from "@/api/status";
import {Ergebnis} from "@/api/ergebnis";
import {TIME_UNIT} from "@/contexts/ApplicationContext";

export const StatusListComponent: React.FC = () => {
    const { semester } = useApplicationContext();

    if (!semester) return <Alert color="warning">Wählen Sie erst ein Semester aus </Alert>;

    return (
        <StatusListRendererComponent semesterId={semester.id} />
    );
};

type PropsStatusListRenderer = {
    semesterId: string;
};
const StatusListRendererComponent: React.FC<PropsStatusListRenderer> = (props) => {
    const { semesterId } = props;
    const { getStatusBySemesterId, getErgebnisBySemesterId } = useApplicationContext();

    const {
        data: statusList,
        isLoading,
        error,
    } = useSWR<Status[]>(`getStatusBySemesterId-${semesterId}`, async () => await getStatusBySemesterId(semesterId));

    const {
        data: ergebnisList,
        isLoading: isLoadingErgebnis,
        error: errorErgebnis,
    } = useSWR<Ergebnis[]>(`getErgebnisBySemesterId-${semesterId}`, async () => await getErgebnisBySemesterId(semesterId));

    const resolveTotalPlayTimeOfPlayer = useCallback((playerId: string): number => {
        if (!ergebnisList) return 0;
        const resultsOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId);

        if (resultsOfPlayer.length === 0) return 0;

        return resultsOfPlayer.reduce((acc: number, curr: Ergebnis) => acc + (curr.geloestIn ?? 0), 0);
    }, [ergebnisList]);

    const resolveAveragePlayTime = (): string => {
        if (!ergebnisList) return `0 ${TIME_UNIT}`;
        const allPlayerIds = ergebnisList.map((e) => e.spieler.id);

        const playerIdsDistinct = allPlayerIds.reduce((acc: string[], curr: string) => acc.find((i) => i === curr) ? acc : [...acc, curr], []);

        const totalPlayTimeOfPlayer = playerIdsDistinct.map((id) => resolveTotalPlayTimeOfPlayer(id));

        const sum = totalPlayTimeOfPlayer.reduce((acc: number, curr: number) => acc + curr, 0);

        return `${(sum / playerIdsDistinct.length).toFixed(0)} ${TIME_UNIT}`;
    }

    if (isLoading || isLoadingErgebnis || !statusList) return <Alert color="warning">Wird geladen...</Alert>;

    if (error || errorErgebnis) return <Alert color="danger">Fehler beim Laden der Daten</Alert>;

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
                value={resolveAveragePlayTime()}
            />
        </StatusListContainer>
    );
}

const StatusListContainer = styled(Box)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: var(--gap-3);
    
    @media screen and (max-width: 900px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
`;
