"use client";
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Stack} from "@mui/joy";
import {SemesterSelectionComponent} from "@/components/shared/SemesterSelectionComponent";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Ergebnis} from "@/api/ergebnis";
import {Interaktion} from "@/api/interaktion";
import {Spieler} from "@/api/spieler";
import {Aufgabe, CleanResult, TIME_UNIT} from "@/contexts/ApplicationContext";
import {ResultsTableComponent} from "@/components/ResultsTableComponent";

export const ResultComponent: React.FC = () => {
    const { semester } = useApplicationContext();

    return (
        <Stack spacing={"var(--gap-4)"}>
            <Stack>
                <Box sx={{ alignSelf: "flex-start" }}>
                    <SemesterSelectionComponent />
                </Box>
            </Stack>
            {semester ?
                <ResultWrapperComponent semesterId={semester.id}>
                    {(cleanResults) => <ResultsTableComponent results={cleanResults} />}
                </ResultWrapperComponent> :
                <Alert color="warning">Wählen Sie erst ein Semester aus </Alert>
            }
        </Stack>
    );
};

type PropsResultWrapper = {
    semesterId: string;
    children: (cleanResults: CleanResult[]) => void;
};
const ResultWrapperComponent: React.FC<PropsResultWrapper> = (props) => {
    const { semesterId, children } = props;
    const { getErgebnisBySemesterId, getInteraktionBySpielerIdAndAufgabeId, getSpielerListBySemesterId } = useApplicationContext();
    const [interactionList, setInteractionList] = useState<Interaktion[] | undefined>(undefined);
    const [spielerList, setSpielerList] = useState<Spieler[] | undefined>(undefined);

    const {
        data: ergebnisList,
        isLoading: isLoadingErgebnis,
        error: errorErgebnis,
    } = useSWR<Ergebnis[]>(`getErgebnisBySemesterId-${semesterId}`, async () => await getErgebnisBySemesterId(semesterId));

    const loadInteractions = useCallback(async () => {
        if (!ergebnisList) return;
        const loadedInteractions = await Promise.all(
            ergebnisList.map((e) => getInteraktionBySpielerIdAndAufgabeId(e.spielerId, e.aufgabeId))
        );
        const flatListOfLoadedInteractions = loadedInteractions.flat();
        setInteractionList(flatListOfLoadedInteractions);
    }, [ergebnisList, getInteraktionBySpielerIdAndAufgabeId]);

    const loadSpieler = useCallback(async () => {
        const loadedSpieler = await getSpielerListBySemesterId(semesterId);
        setSpielerList(loadedSpieler);
    }, [getSpielerListBySemesterId, semesterId]);

    useEffect(() => {
        loadInteractions();
        loadSpieler()
    }, [ergebnisList, loadInteractions, loadSpieler]);

    const resolveNumberOfInteractionOfPlayerInRoom = useCallback((playerId: string, aufgabeId: string): string => {
        if (!interactionList) return "";
        const interactionsOfPlayer = interactionList.filter((i) => i.spielerId === playerId && i.aufgabeId === aufgabeId);

        if (interactionsOfPlayer.length === 0) return "";

        return interactionsOfPlayer.length.toString();
    }, [interactionList]);

    const resolveTimeSpentInRoomOfPlayer = useCallback((playerId: string, aufgabeId: string): string => {
        if (!ergebnisList) return "";
        const resultOfPlayer = ergebnisList.find((e) => e.spielerId === playerId && e.aufgabeId === aufgabeId);

        if (!resultOfPlayer) return "";

        return `${resultOfPlayer.geloestIn.toFixed(0)} ${TIME_UNIT}`;
    }, [ergebnisList]);

    const resolveTotalPlayTimeOfPlayer = useCallback((playerId: string): string => {
        if (!ergebnisList) return "";
        const resultsOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId);

        if (resultsOfPlayer.length === 0) return "";

        return `${resultsOfPlayer.reduce((acc: number, curr: Ergebnis) => acc + curr.geloestIn, 0).toFixed(0)} ${TIME_UNIT}`;
    }, [ergebnisList]);

    const resolveTriesPerTaskOfPlayer = useCallback((playerId: string, aufgabeId: string): string => {
        if (!ergebnisList) return "";
        const resultsOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId && e.aufgabeId === aufgabeId);

        if (resultsOfPlayer.length === 0) return "";

        return resultsOfPlayer.length.toString();
    }, [ergebnisList]);

    const computeCleanResults = useCallback((spielerList: Spieler[]): CleanResult[] => {
        return spielerList.map((s) => ({
            playerId: s.spielerId,
            interactionPerRoom: {
                room1: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_1),
                room2: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_2),
                room3: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_3),
                room4: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_4),
                room5: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_5),
                room6: resolveNumberOfInteractionOfPlayerInRoom(s.id, Aufgabe.AUFGABE_6),
            },
            timeSpentPerRoom: {
                room1: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_1),
                room2: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_2),
                room3: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_3),
                room4: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_4),
                room5: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_5),
                room6: resolveTimeSpentInRoomOfPlayer(s.id, Aufgabe.AUFGABE_6),
            },
            totalPlayTime: resolveTotalPlayTimeOfPlayer(s.id),
            triesPerTask: {
                room1: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_1),
                room2: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_2),
                room3: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_3),
                room4: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_4),
                room5: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_5),
                room6: resolveTriesPerTaskOfPlayer(s.id, Aufgabe.AUFGABE_6),
            },
            hasFinishedGame: false,
            comments: ["Test 1"],
        }));
    }, [resolveNumberOfInteractionOfPlayerInRoom, resolveTimeSpentInRoomOfPlayer, resolveTotalPlayTimeOfPlayer, resolveTriesPerTaskOfPlayer]);

    if (isLoadingErgebnis || !ergebnisList || !interactionList || !spielerList) return <Alert>Wird geladen...</Alert>

    if (errorErgebnis) return <Alert color="danger">{(errorErgebnis as Error).message}</Alert>

    return (
        <>
            {children ? children(computeCleanResults(spielerList)) : null}
        </>
    );
}
