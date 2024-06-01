"use client";
import React, {useMemo} from 'react';
import {Alert, Box, Card, Chip, Sheet, Stack, Typography} from "@mui/joy";
import styled from "styled-components";
import {usePlayerResult} from "@/hooks/usePlayerResult";
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {AufgabeId, TIME_UNIT} from "@/contexts/ApplicationContext";
import {Interaktion} from "@/api/interaktion";
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import SwipeVerticalOutlinedIcon from '@mui/icons-material/SwipeVerticalOutlined';
import {Ergebnis} from "@/api/ergebnis";
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';

type Props = {
    playerId: string;
}
export const ResultDetailComponent: React.FC<Props> = (props) => {
    const { playerId } = props;
    const {
        data: {
            spieler,
            status,
            semester,
            veranstaltung,
            ergebnisList,
            interactionList,
            kommentarList,
        },
        isLoading,
        error,
    } = usePlayerResult(playerId);

    const resolveTaskNumber = (aufgabeId: string): string => {
        switch (aufgabeId) {
            case AufgabeId.AUFGABE_1: return "Rätsel 1";
            case AufgabeId.AUFGABE_2: return "Rätsel 2";
            case AufgabeId.AUFGABE_3: return "Rätsel 3";
            case AufgabeId.AUFGABE_4: return "Rätsel 4";
            case AufgabeId.AUFGABE_5: return "Rätsel 5";
            case AufgabeId.AUFGABE_6: return "Rätsel 6";
            default: return "unbekannt";
        }
    }

    const resolveStatus = (): { statusText: string, isDone: boolean } => {
        if (!status) return { statusText: "unbekannt", isDone: false };
        if (status.istSpielAbgebrochen) return { statusText: "Vorzeitig abgebrochen", isDone: false };
        if (status.istSpielBeendet) return { statusText: "Erfolgreich beendet", isDone: true };
        return { statusText: "Nicht beendet", isDone: false };
    }

    const groupedListKeySeparator = "@" as const;

    const groupedInteractionList = useMemo((): [string, Interaktion[] | undefined][] => {
        if (!interactionList) return [];
        return Object.entries(
            Object.groupBy(interactionList, (p) => `${p.action}${groupedListKeySeparator}${p.aufgabeId}`)
        );
    }, [interactionList]);

    const groupedErgebnisList = useMemo((): [string, Ergebnis[] | undefined][] => {
        if (!ergebnisList) return [];
        return Object.entries(
            Object.groupBy(ergebnisList, (p) => p.aufgabeId)
        );
    }, [ergebnisList]);

    if (isLoading || !spieler || !semester || !veranstaltung || !interactionList || !ergebnisList || !kommentarList) return <div>Wird geladen...</div>;

    if (error) return <Alert color={"danger"}>{(error as Error).toString()}</Alert>

    return (
        <MainContainer component="div">
            <OverviewContainer spacing={"var(--gap-3)"}>
                <OverviewItem>
                    <Typography level="title-lg">Über den Spieler</Typography>
                    <Stack spacing={"var(--gap-2)"}>
                        <Stack>
                            <Typography level={"title-md"}>Spieler-ID</Typography>
                            <Typography>{spieler.spielerId}</Typography>
                        </Stack>
                        <Stack>
                            <Typography level={"title-md"}>Semester</Typography>
                            <Typography>{semester.bezeichnung}</Typography>
                        </Stack>
                        <Stack>
                            <Typography level={"title-md"}>Veranstaltung</Typography>
                            <Typography>
                                {`${veranstaltung.bezeichnung} - ${veranstaltung.name}`}
                            </Typography>
                        </Stack>
                    </Stack>
                </OverviewItem>
                <OverviewItem>
                    <Typography level="title-lg">Status</Typography>
                    <Stack spacing={"var(--gap-2)"}>
                        <Stack spacing={"5px"}>
                            <Typography level={"title-md"}>Spielstatus</Typography>
                            <Chip
                                size="md"
                                variant={"soft"}
                                color={resolveStatus().isDone ? "success" : "danger"}
                                sx={{ px: "12px", py: "7px" }}
                            >
                                {resolveStatus().statusText}
                            </Chip>
                        </Stack>
                    </Stack>
                </OverviewItem>
            </OverviewContainer>
            <Stack spacing={"var(--gap-5)"}>
                <Stack spacing={"var(--gap-2)"}>
                    <Typography level="title-lg">Interaktionen</Typography>
                    {interactionList.length === 0 ? <Alert>Keine Daten gefunden</Alert> :
                        <CustomTableComponent
                            headerCells={
                                <Box component="tr">
                                    <Box component="th" sx={{ width: "50px" }}></Box>
                                    <Box component="th">Raum / Rätsel</Box>
                                    <Box component="th">Interaktion</Box>
                                    <Box component="th">Wie oft</Box>
                                </Box>
                            }
                            bodyRows={groupedInteractionList.map((g, index) => ({
                                content: (
                                    <React.Fragment key={index}>
                                        <Box component="td" sx={{ width: "50px" }}>
                                            <SwipeVerticalOutlinedIcon />
                                        </Box>
                                        <Box component="td">{resolveTaskNumber(g[0].split(groupedListKeySeparator)[1])}</Box>
                                        <Box component="td">{g[0].split(groupedListKeySeparator)[0]}</Box>
                                        <Box component="td">{g[1]?.length}</Box>
                                    </React.Fragment>
                                )
                            }))}
                        />}
                </Stack>
                <Stack spacing={"var(--gap-2)"}>
                    <Typography level="title-lg">Spieldauer</Typography>
                    {ergebnisList.length === 0 ? <Alert>Keine Daten gefunden</Alert> :
                        <>
                            <Alert>
                                <FunctionsOutlinedIcon />
                                <span>Summe: </span>
                                {`${ergebnisList
                                    .reduce((acc: number, curr: Ergebnis) => acc + (curr.geloestIn ?? 0), 0)
                                    ?.toFixed(0)} ${TIME_UNIT}`
                                }
                            </Alert>
                            <CustomTableComponent
                                headerCells={
                                    <Box component="tr">
                                        <Box component="th" sx={{ width: "50px" }}></Box>
                                        <Box component="th">Raum / Rätsel</Box>
                                        <Box component="th">Dauer</Box>
                                    </Box>
                                }
                                bodyRows={groupedErgebnisList.map((g, index) => ({
                                    content: (
                                        <React.Fragment key={index}>
                                            <Box component="td" sx={{ width: "50px" }}>
                                                <AccessAlarmsOutlinedIcon />
                                            </Box>
                                            <Box component="td">{resolveTaskNumber(g[0])}</Box>
                                            <Box component="td">
                                                {(g[1]?.reduce((a, b) => a + (b.geloestIn ?? 0), 0) ?? 0)?.toFixed(0)} {TIME_UNIT}
                                            </Box>
                                        </React.Fragment>
                                    )
                                }))}
                            />
                        </>
                    }
                </Stack>
                <Stack spacing={"var(--gap-2)"}>
                    <Typography level="title-lg">Versuche</Typography>
                    {ergebnisList.length === 0 ? <Alert>Keine Daten gefunden</Alert> :
                        <>
                            <Alert>
                                <FunctionsOutlinedIcon />
                                <span>Summe: </span>
                                {ergebnisList.length} Versuche
                            </Alert>
                            <CustomTableComponent
                                headerCells={
                                    <Box component="tr">
                                        <Box component="th" sx={{ width: "50px" }}></Box>
                                        <Box component="th">Raum / Rätsel</Box>
                                        <Box component="th">Versuche</Box>
                                    </Box>
                                }
                                bodyRows={groupedErgebnisList.map((g, index) => ({
                                    content: (
                                        <React.Fragment key={index}>
                                            <Box component="td" sx={{ width: "50px" }}>
                                                <AccessAlarmsOutlinedIcon />
                                            </Box>
                                            <Box component="td">{resolveTaskNumber(g[0])}</Box>
                                            <Box component="td">{g[1]?.length}</Box>
                                        </React.Fragment>
                                    )
                                }))}
                            />
                        </>
                    }
                </Stack>
                <Stack spacing={"var(--gap-2)"}>
                    <Typography level="title-lg">Kommentare</Typography>
                    <Stack spacing={"var(--gap-1)"}>
                        {kommentarList.length === 0 ? <Alert>Keine Daten gefunden</Alert> : kommentarList.map((k, index) =>
                            <Sheet
                                key={`${k.inhalt}${index}`}
                                variant={"outlined"}
                                sx={{
                                    p: "var(--gap-2)",
                                    borderRadius: "var(--gap-1)"
                                }}
                            >
                                <Typography level={"body-sm"} sx={{ alignSelf: "flex-end", textAlign: "right", mb: 1 }}>
                                    {k.creationTimestamp.toLocaleDateString([], {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute:"2-digit"})}
                                </Typography>
                                <Typography>{k.inhalt}</Typography>
                            </Sheet>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </MainContainer>
    );
};
const MainContainer = styled(Box)`
    display: grid;
    grid-gap: var(--gap-4);
    grid-template-columns: minmax(300px, 1fr) 4fr;
    align-items: start;
    align-content: start;
    @media screen and (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;
const OverviewContainer = styled(Stack)`
    position: sticky;
    max-height: 100vh;
    top: 15%;
    @media screen and (max-width: 900px) {
        position: unset;
        max-height: unset;
        top: unset;
    }
`;
const OverviewItem = styled(Card)`
    display: grid;
    gap: var(--gap-3);
    padding: var(--gap-2);
    //border: 1px solid var(--color-divider);
    //border-radius: 8px;
    //padding: var(--gap-3);
`;
